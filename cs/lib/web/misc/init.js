/**
 * @author elcc
 */

dojo.provide("cs.lib.web.misc.init");




	/**
	 * Open a page in an iframe
	 */
	cs.componentContainer.push({
		name : "cs.web.misc.download",
		description : "This module downloads a file from the web",
		inputs : 
			[
				{
					name: "URL",
					type: "cs.type.String"
				},
				{
					name: "to local path",
					type: "cs.type.String"
				}
			],
		outputs:  
			[],
		image: "web/misc/download.png",
		exec : function(state){
			this.setAsync();
			//get url
			var url = state.inputs.item(0).getValue();
			if(url.indexOf("ttp://")!=1){
				url = "http://"+url;
			}
			var toPath = state.inputs.item(1).getValue().replace("\\","\\\\");
		
			
			try {			
				//new obj_URI object
				var obj_URI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(url, null, null);

				//new file object
				var obj_TargetFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

				//set file with path
				obj_TargetFile.initWithPath(toPath);
				//if file doesn't exist, create
				if(!obj_TargetFile.exists()) {
					obj_TargetFile.create(0x00,0644);
				}

				//new persitence object
				var obj_Persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Components.interfaces.nsIWebBrowserPersist);

				// with persist flags if desired
				const nsIWBP = Components.interfaces.nsIWebBrowserPersist;
				const flags = nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
				obj_Persist.persistFlags = flags | nsIWBP.PERSIST_FLAGS_FROM_CACHE;


				var component = this;
				
				obj_Persist.progressListener = {
						  onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
						    var percentComplete = (aCurTotalProgress/aMaxTotalProgress)*100;
						    state.view.setValue(percentComplete);
						  },
						  onStateChange: function(aWebProgress, aRequest, aStatus, aMessage) {
						    // do something
							 if( aStatus & Components.interfaces.nsIWebProgressListener.STATE_STOP ){
								 component.finishAsync();	 
							 }
						  }
						}
				
				
				//save file to target
				obj_Persist.saveURI(obj_URI,null,null,null,null,obj_TargetFile);
			} catch (e) {
				alert(e);
			}

		},			
		view : {
			// how to prevent changing style on each lamp?
			source : "<span>0%</span>",
			
			setValue : function(a_value){
				this.getNode().innerHTML = Math.round(a_value)+"%";
			}
		}
	});
	
