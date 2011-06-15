/**
 * @author elcc
 * 
 * CLASS cs.controller.IdeController 
 * 
 * @description: This Class is needed to build a IDE to develop clickscripts.
 * 
 */
	
	dojo.provide("cs.controller.NewIdeController");

	dojo.require("dojox.gfx");
	dojo.require("cs.controller.LibraryController");	
	dojo.require("cs.controller.ViewController");		
	dojo.require("cs.controller.ModelController");	
	dojo.require("cs.controller.ExecutionController");
	dojo.require("cs.controller.ExecutionViewController");
	dojo.require("cs.view.util.EasyConsole");
	dojo.require("cs.view.util.Toggler");
	dojo.require("cs.system.ScriptPlayer");
	dojo.require("cs.system.PersistanceManager");
	
	dojo.require("dojo.dnd.Source");
		
 	dojo.declare("cs.controller.NewIdeController", null, {
		



		constructor : function(){
 			
 			// setup basic html for ClickSciript into the HTML-Tag with id="clickscript"
 			
			/**
			 * SURFACE: Prepare the surface with the ClickScript playground
			 */
			var nodePlayground = dojo.byId("csPlayground");
					
			var width = cs.config.playground.width; // set html width / height on playground : required!
			var height = cs.config.playground.height;
			
			var currentWidth = dojo.style(dojo.byId('csPlayground'),"width");
			if(currentWidth > width){width = currentWidth;}
			
			var	playground = dojox.gfx.createSurface(nodePlayground, width, height).createGroup();
			dojo.style(nodePlayground,"width",width+"px");
			dojo.style(nodePlayground,"height",height+"px");
			
			
			/**
			 * CONSOLE
			 */
			var source = "<div id='csConsoleTitle'>console</div><div id='csEasyConsole'></div>";
			dojo.place(source,dojo.byId("csConsole"));
			
			cs.console = new cs.view.util.EasyConsole("csEasyConsole");
			cs.console.setIsDebug(cs.config.isDebug);
			dojo.style(cs.console.getNode(),"width","auto");
			
			/**
			 * LIBRARIES: Load libraries if there are any
			 */
			if(cs.componentContainer){
				cs.library.addMetaComponents(cs.componentContainer);
			}
			
			// DEPRICATED componentContainer (v0.5)
			if(window.csComponentContainer && window.csComponentContainer.length > 0){
				console.warn("DEPRICATED: csComponentContainer -- Use cs.componentContainer instead!");
				cs.library.addMetaComponents(csComponentContainer);
			}
			
			/**
			 * Setup ClickScript model and controllers
			 */
			
			// Model for the Script
			cs.modelController = new cs.controller.ModelController();
			
			// Playground where you can perform actions like wireing two components
			cs.viewController = new cs.controller.ViewController(playground,cs.modelController);
			
			// Model of the Execution View
			cs.executionController = new cs.controller.ExecutionController(cs.modelController);
			
			// View of the Execution View
			cs.executionViewController = new cs.controller.ExecutionViewController();
			
			// Register observers to the model
			cs.modelController.registerObserver(cs.viewController);
			cs.modelController.registerObserver(cs.executionController);
			
			// init option / configuration dialog
			this.initOptions();
			
			// init library
			this.initLibrary();
			
			// register events on mouseenter and mouseleave
			// of component on programming view
			dojo.subscribe("view/program/mouseenter",this,function(componentModel){
				var text = "<div class='csInfoUid csInfoLine'><span class='csInfoTitle'>uuid: </span>"+componentModel.getUid()+"</div>";
				this.showInfo(componentModel.getDescriptionAsHTML()+text);
			});
			dojo.subscribe("view/program/mouseleave",this,function(data){
				this.hideInfo();
			});			
			
			
			// init playground dopper
			//dojo.connect(nodePlayground, "onDndDrop", this, "onDropComponentItem");
			
			/*
			var target = new dojo.dnd.Target(nodePlayground,{ checkAcceptance:function(){
				return true;
			}, creator: function(){
				alert("test");
			}});
			dojo.connect(nodePlayground)
			dojo.connect(target,"onDndDrop",this,"onDropComponentItem");
			dojo.connect(target,"onDropExternal",function(a,b,c){
				alert("drop external");
			});
			*/
			
			/**
			 * Init userselect
			 */
		    var menu = new dijit.Menu({
	            style: "display: none;"
	        });
	        
	        var allAccounts = cs.global.persistanceManager.getAccounts();
	        dojo.forEach(allAccounts, function(account,index){

		        var menuItem = new dijit.MenuItem({
		            label: account.name,
		            onClick: function() {
		            	dijit.byId("change-user-guid").set('value',account.guid);
				        dijit.byId("change-user-token").set('value',account.token);
		            }
		        });
	        	menu.addChild(menuItem);
	        },this);
	
	        var button = new dijit.form.DropDownButton({
	            label: "Choose predefined user",
	            name: "change-user",
	            dropDown: menu,
	            id: "dropdown-change-user"
	        });
	        dojo.byId("select-user").appendChild(button.domNode);

			
			cs.console.write("ClickScript IDE loaded.");
 		},
 	
 		/**
 		 * Init Option Dialog
 		 */
 		initOptions : function(){
 			
				// Init ClickScript Debug Mode
				dijit.byId("checkbox-debug-mode").set({
					onChange:function(checked){
						cs.console.setIsDebug(checked);
						cs.console.write("CHANGED DEBUG-MODE TO: "+checked);
					},
					value:cs.console.isDebug()
				});
				
				// Init Dojo Debug Mode
				dijit.byId("checkbox-debug-dojo").set({
					onChange:function(checked){
						dojo.config.isDebug = checked;
						cs.console.write("CHANGED DOJO-DEBUG-MODE TO: "+checked);
					},
					value:dojo.config.isDebug
				});
				
				// Init Worklist-Player
				dijit.byId("checkbox-debug-worklist").set({
					onChange:function(checked){
						cs.executionController.getWorklist().setIsDebug(checked);
						cs.console.write("CHANGED DEBUG-WORKLIST-MODE TO: "+checked);
					},
					value:cs.executionController.getWorklist().isDebug()
				});
 		},
 		
 		onDropComponentItem : function( source, nodes, copy, target ){
 			alert('dropped');
 		},
 		
 		_libraryStyle : "top",
 		
 		initLibrary : function(){
 			// Get all loaded libraries
			var loadedComponents = cs.library.getMetaComponentsByCategory();
			
			// Prepare visibility switches for option box
			loadedComponents.forEach(function(category,categoryname){
				var typeToolbar = new dijit.TitlePane({
		            title: categoryname,
		            content: "no module loaded",
		            open: false
		        });
		        
		        // container for buttons
		        var buttonNodeList = new dojo.NodeList();
		        
		        category.forEach(function(metaComponent,buttonname){
		        	// generate a button and add to button-container
		        	if(!metaComponent.isProgram()){
		        		buttonNodeList = buttonNodeList.concat(this.getToolbarButton(metaComponent).domNode);
		        	}
		        },this);
		        typeToolbar.set('content',buttonNodeList);
		        dojo.addClass(typeToolbar.domNode,"categoryToolBar");
		        
		        if(this._libraryStyle == "top"){
		        	typeToolbar.set('open',true);
		        	dojo.byId("csToolBarTop").appendChild(typeToolbar.domNode);
		        } else {
		        	typeToolbar.set('open',false);
		        	dojo.byId("csToolBarRight").appendChild(typeToolbar.domNode);		        	
		        }
		        // make buttons draggable
		        // Buttons must have a class="dojoDndItem"
		        /*
		        if(typeToolbar.getChildren()&&typeToolbar.getChildren()[0]){
		        	var contentNode = typeToolbar.getChildren()[0].domNode.parentNode;
		        	var source = new dojo.dnd.Source(contentNode);
		        }*/
			},this);
			
			var br = dojo.doc.createElement('br');
			dojo.addClass(br,"clear")
			if(this._libraryStyle == "top"){
	        	dojo.byId("csToolBarTop").appendChild(br);
	        } else {
	        	dojo.byId("csToolBarRight").appendChild(br);		        	
	        }
 		},
 		
 		/**
 		 * Returns a dijit.form.Button for a given Meta-Component
 		 * @param {cs.model.meta.MetaComponent} 
 		 * 
 		 * @return {dijit.form.Button} a Dijit Button
 		 */
 		getToolbarButton : function(a_metaComponent){
			var imagePath = cs.config.rootPath + "lib/"+(a_metaComponent.getImgPath()?a_metaComponent.getImgPath():"default.gif");
        	
        	var buttonLabel = "";
        	
        	if(a_metaComponent.isPrimitive()){
        		var c = new dojo.Color(); 
				c.setColor(a_metaComponent.getFields().item(0).getType().getColor()); 
        		buttonLabel = "<span class='primitiveButton' style='background-color:"+c.toHex()+"'></span>";
        	} else {
        		buttonLabel = "<img src='"+imagePath+"'/>";
        	}
        	
        	var self = this;
        	
        	// create new button
        	var button = new dijit.form.Button({
        		label:buttonLabel,
        		showLabel : true,
        		title: a_metaComponent.getName().replace(/^.*\./,""),
        		onClick : function(event){
        			
        			cs.modelController.addComponent(a_metaComponent.getName(),{x:0+Math.round(Math.random()*40),y:0+Math.round(Math.random()*40)},{x:0,y:0});
        			
        			/* HACK TO BLUR */
	        		dojo.byId("blur-widget").focus()
        		},
        		onMouseEnter : function(event){
        			/*show info*/
        			//dojo.byId("csInfo").innerHTML = a_metaComponent.toHTML();
        			self.showInfo(a_metaComponent.toHTML());
        			//dojo.publish("controller/IdeController/showInfo",[a_metaComponent.toHTML()]);
        		},
        		onMouseLeave : function(event){
        			//dojo.byId("csInfo").innerHTML="" ;
        			self.hideInfo();
        			//dojo.publish("controller/IdeController/hideInfo",[]);
        		}
        	});
        	
        	//dojo.addClass(button.domNode,"dojoDndItem");
        	dojo.addClass(button.domNode,"toolBarButton");
        	return button;
 		}, 		

		hideInfo : function(){
			dojo.style(dojo.byId("csInfo"),"display","none");
			dojo.byId("csInfo").innerHTML="" ;
		},
		
		showInfo : function(text){
			dojo.byId("csInfo").innerHTML = text;
			dojo.style(dojo.byId("csInfo"),"display","block");
		},
		
		/**
		 * Show dialog to select a new script.
		 */
		showLoadDialog : function(){
			
			// show dialog
			dijit.byId('dialog-load').show();
			
			// callback function after getting users scripts
			var listScripts = function(scripts){
				var result = "<table><tr><th>name</th><th>load</th><th>delete</th><th>last change</th></tr>";
				dojo.forEach(scripts,function(script,index){
			 		//loadedScripts[index] = script.code;
			 		var date    = new Date(script.updated_at*1000);
			 		var day     = ((date.getDate()<10)?"0":"")+date.getDate();
			 		var month   = (((date.getMonth()+1)<10)?"0":"")+(date.getMonth()+1);
			 		var hour    = ((date.getHours()<10)?"0":"")+date.getHours();
			 		var minutes = ((date.getMinutes()<10)?"0":"")+date.getMinutes();
			 		    date = day+"."+month+"."+date.getFullYear()+" "+hour+":"+minutes;
			 		result += 	"<tr><td>"+script.name+".cs</td>"+
			 					"<td><input type='button' value='run' onclick='cs.global.ide.runLoadedScript("+script.id+")'/></td>"+
			 					"<td><input type='button' value='x'   onclick='cs.global.ide.deleteScript("+script.id+")'/></td>"+
			 					"<td>"+date+"</td></tr>";
			 	}); 	
			 	result += "</table>";
			 	dojo.byId("list-scripts").innerHTML = result;
			}
			
			// get the scritps and sho list
			cs.global.persistanceManager.getScripts(listScripts);
		},
		
		/**
		 * Run a script by the script id
		 */
		runLoadedScript : function(scriptid){
			// loadScript
			cs.global.persistanceManager.loadScript(scriptid);

			dijit.byId('dialog-load').hide();
		},
		
		/**
		 * Save loaded script
		 */
		saveScript : function(){
			cs.global.persistanceManager.saveScript(cs.modelController.serializeScript());
		},
		
		/**
		 * Save As Script
		 */
		saveAsScript : function(name){
			cs.global.persistanceManager.saveAsScript(cs.modelController.serializeScript(),name);
			dijit.byId('dialog-save-as').hide();
		},
		
		/**
		 * Delete Script
		 */
		deleteScript : function(id){
			
			if(confirm("Are you sure you want delete this script? "+cs.global.persistanceManager.getScript(id).name+".cs")){
				cs.global.persistanceManager.deleteScript(id);
			
				// reload load dialog
				this.showLoadDialog();				
			}
			
		},
		
		/**
		 * change the current user
		 */
		changeUser : function(guid,token){
			cs.global.persistanceManager.setUser(guid,token);
			dijit.byId('dialog-configuration').hide();
		}
		
			
	});