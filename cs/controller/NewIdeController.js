/**
 * @author elcc
 * 
 * CLASS cs.controller.IdeController 
 * 
 * @description: This Class is needed to build a IDE to develop clickscripts.
 * 
 */
	
	dojo.provide("cs.controller.NewIdeController");

	dojo.require("dojox.fx.scroll");
	dojo.require("dojox.gfx");
	dojo.require("cs.controller.LibraryController");	
	dojo.require("cs.controller.ViewController");		
	dojo.require("cs.controller.ModelController");	
	dojo.require("cs.controller.ExecutionController");
	dojo.require("cs.controller.ExecutionViewController");
	dojo.require("cs.view.util.EasyConsole");
	dojo.require("cs.view.util.Toggler");
	dojo.require("cs.system.ScriptPlayer");
	
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
		        
		        dojo.byId("csToolBar").appendChild(typeToolbar.domNode);			
			},this);
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
        	
        	// create new button
        	var button = new dijit.form.Button({
        		label:buttonLabel,
        		showLabel : true,
        		title: a_metaComponent.getName().replace(/^.*\./,""),
        		onClick : function(event){
        			cs.modelController.addComponent(a_metaComponent.getName(),{x:200+Math.round(Math.random()*40),y:200+Math.round(Math.random()*40)},{x:0,y:0});
        			/* HACK TO BLUR */
        			//dijit.focus(dijit.findWidgets(dojo.byId("csToolBar"))[0].focusNode);
        			//dijit.focus(dijit.findWidgets(dojo.byId("blur-widget"))[0].focusNode);
        		dojo.byId("blur-widget").focus()
        		}
        	});
        	
        	return button;
 		} 		

			
	});