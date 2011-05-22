/**
 * @author elcc
 * 
 * 
 * IMPORTANT: RUNNING THIS PLUGIN CAN GET PROBLEMS WITH FIREBUG! WAITING ON BUGFIXING ON THEIRE SITE! (since ff3.5)
 */

/**
 * TODO: 
 *   URL: 3 outputs : domain, path, file
 *   Find Links: (field filefilter)
 */

dojo.provide("cs.lib.web.browse.init");


dojo.require("cs.lib.web.browse.Util");


	window.webBrowseUtil = new cs.lib.web.browse.Util();

	/**
	 * Add the type for frames
	 */
	if(!cs.library.hasType("cs.type.Browser")){
		cs.library.addTypeStructure("cs.type.Browser","rgba(131,62,143,1)");
	}

	/**
	 * Open a page in an iframe
	 */
	cs.componentContainer.push({
		name : "cs.web.browse.open",
		description : "This module opens a page in a iframe",
		inputs : 
			[
				{
					name: "URL",
					type: "cs.type.String"
				}
			],
		outputs:  
			[
				{
					name: "iframe id",
					type: "cs.type.Browser"
				}
			],
		image: "web/browse/open.png",
		exec : function(state){
			var url = state.inputs.item(0).getValue();
			if(url.indexOf("ttp://")!=1){
				url = "http://"+url;
			}
			
			// because of ajax set module async
			this.setAsync();
			
			// set iframe Id to access through reset
			if(!this.iframeId){
				this.iframeId = webBrowseUtil.createEmptyFrame(null,state.view.getNode());
			}
			var iframeId = this.iframeId;
			
			// register load new page in new frame
			var component = this;
			webBrowseUtil.loadIframe(iframeId,url,
					function(){
						// set output
						state.outputs.item(0).setValue(iframeId);	
						
						// finish async module
						component.finishAsync();
			});
		},
		view : {source : "<div style='width:300px;height:150px;background-color:white'></div>"},
		reset : function(){
			// clean up the old frame
			if(this.iframeId){
				webBrowseUtil.getIframe(this.iframeId).srd = "";
			}
		}
	});
	
	
	
	/**
	 * Get source code of an iframe
	 */
	cs.componentContainer.push({
		name : "cs.web.browse.source-code",
		description : "This module returns the code of a frame",
		inputs : 
			[
				{
					name: "mini Browser",
					type: "cs.type.Browser"
				}
			],
		outputs:  
			[
				{
					name: "code",
					type: "cs.type.String"
				}
			],
			image: "web/browse/code.png",
		exec : function(state){
			var frameId = state.inputs.item(0).getValue();
			
			var iframe = webBrowseUtil.getIframe(frameId);
			
			// set output
			state.outputs.item(0).setValue(iframe.contentDocument.documentElement.innerHTML);

		}
	});
	
	
	/**
	 * Set first input field of a page
	 */
	cs.componentContainer.push({
		name : "cs.web.browse.fill-form",
		description : "This module enters a value on the Nth input field of a page",
		inputs : 
			[
				{
					name: "mini Browser",
					type: "cs.type.Browser"
				},
				{
					name: "value",
					type: "cs.type.String"
				},
				{
					name: "n",
					type: "cs.type.Number"
				}
			],
		outputs:  
			[
				{
					name: "mini Browser",
					type: "cs.type.Browser"
				}
			],
			image: "web/browse/field.png",
		exec : function(state){
			// get inputs
			var frameId = state.inputs.item(0).getValue();	
			var value = state.inputs.item(1).getValue();
			var n = state.inputs.item(2).getValue()-1;
			
			// get iframe
			var iframe = webBrowseUtil.getIframe(frameId);
			
			// get Nth textfield and set the new value
			$(iframe.contentDocument.documentElement).find("input[type=text]:eq("+n+")").val(value);
			
			// set output
			state.outputs.item(0).setValue(frameId);
		}
	});
	
	/**
	 * Button clicked
	 */
	cs.componentContainer.push({
		name : "cs.web.browse.click-button",
		description : "This module clicks on the Nth button",
		inputs : 
			[
				{
					name: "mini Browser",
					type: "cs.type.Browser"
				},
				{
					name: "n",
					type: "cs.type.Number"
				}
			],
		outputs:  
			[
				{
					name: "mini Browser",
					type: "cs.type.Browser"
				}
			],
			image: "web/browse/click.png",
		exec : function(state){
			var frameId = state.inputs.item(0).getValue();
			var number = state.inputs.item(1).getValue()-1;
			var iframe = webBrowseUtil.getIframe(frameId);
			var component = this;
			
			// set module async because of the loading in the frame
			this.setAsync();
			
			this._isClicked = false;
			
			// register event onLoad
			$(iframe).one("load",function(){
				console.log(frameId);
								console.log("fired on load");
								 component._isClicked = true;
								  state.outputs.item(0).setValue(frameId);
                                  component.finishAsync();
                                  
			});
			
			// hack to make sure is executed by buggy browsers
			setTimeout(function(){
				if(!component._isClicked){
					  console.log("settimeout button"+frameId);
					  state.outputs.item(0).setValue(frameId);
                      component.finishAsync();				
				}				
			},8000);

			// do click on button
			try {
				//jquery returns error
				//$(iframe.contentDocument.documentElement).find("input[type=submit]:eq("+number+")").click();
				
				// click on button
				console.log(dojo.query("input[type=submit]",iframe.contentDocument.documentElement)[number]);
				console.log("length" , dojo.query("input[type=submit]",iframe.contentDocument.documentElement).length);
				console.log(dojo.query("input[type=submit]",iframe.contentDocument.documentElement),number);
				dojo.query("input[type=submit]",iframe.contentDocument.documentElement)[parseInt(number)].click();
				
				// reload to trigger load event
				//iframe.contentDocument.location.reload(true);
			} catch (e){
			        console.log(e);
			}
			

		}
	});
	
	/**
	 * Open a page in a new Tab
	 */
	/* NOT YET READY
	cs.componentContainer.push({
		name : "cs.web.browse.InNewTab",
		description : "This module opens a page in a new window",
		inputs : 
			[
				{
					name: "URL",
					type: "cs.type.String"
				}
			],
		outputs:  [],
		image: "web/browse/open.png",
		exec : function(state){
			//var url = state.inputs.item(0).getValue();			
			//window.open(url);
			alert(window.content.document.getElementById("abcdef").contentDocument.documentElement.innerHTML);
		}
	});
	*/
	
	/**
	 * Set first input field of a page
	 */
	cs.componentContainer.push({
		name : "cs.web.browse.print",
		description : "This module prints it",
		inputs : 
			[
				{
					name: "mini Browser",
					type: "cs.type.Browser"
				}
			],
		outputs:  
			[],
			image: "web/browse/print.png",
		exec : function(state){
			var frameId = state.inputs.item(0).getValue();	
			console.log("print ",frameId,window.frames);
			//focus and print the iframe
			try{
				top.frames[frameId].focus();
				top.frames[frameId].print();
			} catch(e){
				console.log("ERROR: "+e + frameId);
			}
			
		}
	});
	

