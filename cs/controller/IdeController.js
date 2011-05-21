/**
 * @author elcc
 * 
 * 
 */
	
	dojo.provide("cs.controller.IdeController");
	
	
	dojo.require("dojox.fx.scroll");
	
	dojo.require("dojox.gfx");
	dojo.require("cs.controller.LibraryController");	
	dojo.require("cs.controller.ViewController");		
	dojo.require("cs.controller.ModelController");	
	dojo.require("cs.controller.ExecutionController");
	dojo.require("cs.controller.ExecutionViewController");
	
	dojo.require("cs.view.util.EasyConsole");
	dojo.require("cs.view.util.Toggler");
	

	
	
 	dojo.declare("cs.controller.IdeController", null, {
		
 		playgroundWidth : 1000,
 		playgroundHeight : 500,
 		
 		
		constructor : function(){
 			
 		    // init global variables
 		    window.cs.modelController = null;
 			window.cs.viewController = null;	
 			window.cs.config = null;
 			
 			cs.config = {
 					rootPath : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" )
 			};
 			
			// prepare surface
			var nodePlayground = dojo.byId("csPlayground");
			
			
			// set html width / height on playground : required!

			
			var width = this.playgroundWidth;
			var height = this.playgroundHeight;
			
			
			var currentWidth = dojo.style(dojo.byId('csPlayground'),"width");
			if(currentWidth > width){width = currentWidth;}
			
			var	playground = dojox.gfx.createSurface(nodePlayground, width, height).createGroup();
			dojo.style(nodePlayground,"width",width+"px");
			dojo.style(nodePlayground,"height",height+"px");
			
			
			// prepare console
			var source = "<div id='csConsoleTitle'>console</div><div id='csEasyConsole'></div>";
			dojo.place(source,dojo.byId("csConsole"));
			
			
			cs.console = new cs.view.util.EasyConsole("csEasyConsole");
			cs.console.setIsDebug(false);
			dojo.style(cs.console.getNode(),"width","auto");
			//dojo.style(cs.console.getNode(),"width",(width+20)+"px");

			// get preloaded components if there are any
			if(window.csComponentContainer){
				cs.library.addMetaComponents(csComponentContainer);
			}
			
			// model controller
			cs.modelController = new cs.controller.ModelController();
			cs.viewController = new cs.controller.ViewController(playground,cs.modelController);
			cs.executionController = new cs.controller.ExecutionController(cs.modelController);
			cs.executionViewController = new cs.controller.ExecutionViewController();
			//cs.executionViewController.setWidth(this.playgroundWidth-10); //-10 because of the padding
			
			// register observers to the model
			cs.modelController.registerObserver(cs.viewController);
			cs.modelController.registerObserver(cs.executionController);
			

			
			cs.console.write("ClickScript IDE loaded.");

 		},
 	
 		/**
 		 * enables library
 		 * should be called after all library loadings!
 		 */

 		showLibrary : function(){
 			
			// init switch functionality to the visibility switches
 			/**
 			 * id_to_toggle: div to show or hide
 			 * id_of_switch: id of the switch to toggle
 			 * on:           state on page load visible or not
 			 * scroll:       enable scrolling to this part of the ide after opening?
 			 */
		    toggleSwitch = function(id_to_toggle,id_of_switch,on,scroll){
		    	if(dojo.byId(id_to_toggle)){
			    	var toggler = new cs.view.util.Toggler(id_to_toggle);
			    	var toggleSwitch = dojo.byId(id_of_switch ? id_of_switch : id_to_toggle+"Switch");
				    if(toggleSwitch){
				    	var srcClose = cs.config.rootPath + "util/images/menuClose.png";
				    	var srcOpen  = cs.config.rootPath + "util/images/menuOpen.png";
				    	if(on){
				    		toggler.show();
				    		dojo.addClass(toggleSwitch,"active");
				    		dojo.query("img",toggleSwitch)[0].src = srcOpen;
				    	} else {
				    		toggler.hide();
				    		dojo.removeClass(toggleSwitch,"active");
				    		dojo.query("img",toggleSwitch)[0].src = srcClose;
				    	}
				    	dojo.connect(toggleSwitch,"onclick",this,function(){
				    		toggler.toggle();
				    		if(toggler.isActive()){
				    			dojo.addClass(toggleSwitch,"active");
				    			dojo.query("img",toggleSwitch)[0].src = srcOpen;
				    			if(scroll){
						        var node = dojo.byId(id_to_toggle);
						        var anm = dojox.fx.smoothScroll({ node: node,
									        win:window,
									        duration:800}).play();
				    			}
				    		} else {
				    			dojo.removeClass(toggleSwitch,"active");
				    			dojo.query("img",toggleSwitch)[0].src = srcClose;
				    		}
				    	});	
			    	}
		    	}
		    };
		    
		    /**
		     * Place visibility switches
		     */
			if(dojo.byId("csViewSwitches")){
				out = "<ul><li><a href='#' id='csExecViewSwitch' style='text-decoration:none;'><strong>Execution View</strong><img src='"+cs.config.rootPath+"util/images/menuClose.png' id='csExecViewSwitchImg'/></a></li>" +
				"<li><a href='#' id='csConsoleSwitch' style='text-decoration:none;'><strong>Console</strong><img src='"+cs.config.rootPath+"util/images/menuClose.png' id='csConsoleSwitchImg'/></a></li>" +
				(dojo.byId("csOptions") ? "<li><a href='#' id='csOptionSwitch' style='text-decoration:none;'><strong>Options</strong><img src='"+cs.config.rootPath+"util/images/menuClose.png' id='csOptionSwitchImg'/></a></li>" : "") +
				"<li><a href='#' id='csLibSwitch' style='text-decoration:none;'><strong>Library</strong><img src='"+cs.config.rootPath+"util/images/menuOpen.png' id='csLibSwitchImg'/></a></li>" +
				(dojo.byId("csTodo") ? "<li><a href='#' id='csTodoSwitch' style='text-decoration:none;'><strong>Todo</strong><img src='"+cs.config.rootPath+"util/images/menuOpen.png' id='csTodoSwitchImg'/></a></li>":"") +
				(dojo.byId("csTutorial") ? "<li><a href='#' id='csTutorialSwitch' style='text-decoration:none;'><strong>Tutorial</strong><img src='"+cs.config.rootPath+"util/images/menuClose.png' id='csTutorialSwitchImg'/></a></li>":"") +
				(dojo.byId("csExercise") ? "<li><a href='#' id='csExerciseSwitch' style='text-decoration:none;'><strong>Exercise</strong><img src='"+cs.config.rootPath+"util/images/menuClose.png' id='csExerciseSwitchImg'/></a></li>":"") +

				"</ul>";
				dojo.place(out,dojo.byId("csViewSwitches"));
				
				toggleSwitch("csLib","csLibSwitch",true);
			    toggleSwitch("csOptions","csOptionSwitch",false);
				//toggleSwitch("csTodo","csTodoSwitch",false);
				toggleSwitch("csTutorial","csTutorialSwitch",false,true);
			    toggleSwitch("csExecutionView","csExecViewSwitch",true);			
				toggleSwitch("csConsole","csConsoleSwitch",false,true);
				toggleSwitch("csExercise","csExerciseSwitch",false,true);
			}
 			
 			
 			// get all loaded libraries by category
			var loadedComponents = cs.library.getMetaComponentsByCategory();
			var out = "";
			// ActionMenu
			out += "<div id='csActionMenu'><strong>Actions:&nbsp;&nbsp;</strong>";					
			//out += "<input onclick='cs.test.newPage( cs.modelController.serializeProgram());' type=\"button\" value=\"serialize\"/>";
			out += "<input onclick='location.reload(true);' type=\"button\" value=\"Clean Up\"/>";
			out += "<input onclick='cs.executionController.run();' type=\"button\" value=\"Run\"/>";
			out += "<input onclick='cs.executionController.repeatedRun();' type=\"button\" value=\"Repeated Run\"/>";
			out += "<input onclick='cs.executionController.stop();' type=\"button\" value=\"Stop\"/>";
			out += "<span class='actionLabel'> runs: </span><span id='runCounter'>0</span><span class='actionLabel'> status: </span><span id='csState'>" +
						"<img title='RUN...' id='csStateRUN' style='display:none' class='csStateIcon' src='"+cs.config.rootPath+"util/images/run.png'/>" +
						"<img title='STOP...' id='csStateSTOP'  style='display:none' class='csStateIcon' src='"+cs.config.rootPath+"util/images/stop.png'/>" +
						"<img title='WAIT...' id='csStateWAIT'  style='display:none' class='csStateIcon' src='"+cs.config.rootPath+"util/images/wait.png'/>" +
						"<img title='FINISH...' id='csStateFINISH' class='csStateIcon' src='"+cs.config.rootPath+"util/images/finish.png'/>" +
					"</span>";
			out += "</div>";
			dojo.place(out,dojo.byId("csActions"));

			
			/**
			 * LOAD LIBRARIES
			 */
			var visibilitySwitches = "<table>";
			loadedComponents.forEach(function(item,key){
				cs.library.showToolbar(key);
				visibilitySwitches += "<tr><td>"+key+"</td><td><input id='csToolbarSwitch"+ key.replace(/\./,"")+"' class='csToolbarSwitch' title='"+key+"' onchange='' type='checkbox' checked='checked'/></td></tr>";
			});
			visibilitySwitches += "</table>";
			cs.library.setLibStyle(cs.library._libStyle);
			
			



			/**
			 * LOAD CS OPTIONS
			 */
			if(dojo.byId("csOptions")){
				out = "<ul id='csOptionList'>" +
					"<li><fieldset><legend>Toolbar</legend>" +
					"		<div id='csOptionToolbarVisibility'></div>" +
					"</fieldset></li>" +
					"<li><fieldset><legend>Debug</legend>" +
					"		<ul>" +
					"			<li><label for='csOptionDebugExecOnOff'>Show Worklist ON/OFF:</label><input type='checkbox' id='csOptionDebugExecOnOff'/></li>" +
					"			<li><label for='csOptionDebugOnOff'>Debug Mode ON/OFF:</label><input type='checkbox' id='csOptionDebugOnOff'/></li>" +
					"		</ul>" +
					"</fieldset></li>" +
					"<li><fieldset><legend>Library</legend>" +
					"		<ul>" +
					"			<li><select id='libraryOp' name='libraryOp' size='3'>" +
					"			      <option value='1'>small</option>" +
					"			      <option value='2'>middle</option>" +
					"			      <option value='3'>large</option>" +
					"			    </select>" +
					"			</li>" +
					"		</ul>" +
					"</fieldset></li>" +				
					"	</ul><br class='clear'/>";	
				
				dojo.place(out,dojo.byId("csOptions"));
				
				// load toolbars

				dojo.place(visibilitySwitches,dojo.byId('csOptionToolbarVisibility'));
				
				// to switch debug messages on / off
				dojo.byId("csOptionDebugOnOff").checked = cs.console.isDebug();
				dojo.connect(dojo.byId("csOptionDebugOnOff"),"onchange",this,function(){
					cs.console.setIsDebug(dojo.byId("csOptionDebugOnOff").checked);
					if(cs.console.isDebug()){
						cs.console.write("DEBUG MODE ON");
					} else {
						cs.console.write("DEBUG MODE OFF");
					}
				});
				
				dojo.byId("csOptionDebugExecOnOff").checked = cs.executionController.getWorklist().isDebug();
				dojo.connect(dojo.byId("csOptionDebugExecOnOff"),"onchange",this,function(){
					cs.executionController.getWorklist().setIsDebug(dojo.byId("csOptionDebugExecOnOff").checked);
					if(cs.executionController.getWorklist().isDebug()){
						cs.console.write("EXECUTION DEBUG MODE ON");
					} else {
						cs.console.write("EXECUTION DEBUG MODE OFF");
					}
				});
				
				dojo.connect(dojo.byId("libraryOp"),"onchange",this,function(){
					cs.library.setLibStyle(dojo.byId("libraryOp").value);
				});
				

			}
			
			/**
			 * LOAD TODOs
			 *//*
			if(dojo.byId("csTodo")){
				var todo = "<span style='color:red;font-size:7pt'>Todo: <ul> " +
								"<li style='color:green'>??</li>"+
							"</ul></span>";
				dojo.place(todo,dojo.byId("csTodo"));
			}*/
			
			/**
			 * LOAD TUTORIALs
			 */
			
			if(dojo.byId("csTutorial")){
				var url = dojo.byId("csTutorial").innerHTML;
				url = (url) ? url : cs.config.rootPath+"util/tutorial/tutorialEN.html";
				var tutorial = "<div id='csTutorialTitle'>tutorial</div><iframe src='"+url+"'/>";
				dojo.place(tutorial,dojo.byId("csTutorial"));
			}
			
			
			/**
			 * LOAD EXERCISEs
			 */
			
			if(dojo.byId("csExercise")){
				var url = dojo.byId("csExercise").innerHTML;
				url = (url) ? url : cs.config.rootPath+"util/exercise/index.html";
				var tutorial = "<div id='csExerciseTitle'>exercises</div><iframe src='"+url+"'/>";
				dojo.place(tutorial,dojo.byId("csExercise"));
			}
			
			
			var toolbarSwitches = dojo.query(".csToolbarSwitch");
			toolbarSwitches.forEach(function(tbSwitch){
				dojo.connect(tbSwitch,"onchange",null,function(html){
					var category = this.title;
					var checked = this.checked;
					if(checked && !cs.library.isToolbarOn(category)){
						cs.library.showToolbar(category);
					}
					if(!checked && cs.library.isToolbarOn(category)){
						cs.library.hideToolbar(category);
					}
				});
			});
			
			// update switches in case some one adds or removes toolbar
			updateOptionSwitches = function(){
				var toolbarSwitches = dojo.query(".csToolbarSwitch");
				toolbarSwitches.forEach(function(tbSwitch){
					var category = tbSwitch.title;
					if(tbSwitch.checked != cs.library.isToolbarOn(category)){
						tbSwitch.checked = !tbSwitch.checked ? 'checked' : '';
					}
					console.log(category+"*"+tbSwitch.checked+"*"+cs.library.isToolbarOn(category));
				});
			};
			
			dojo.connect(cs.library,"onShowToolbar",null,function(){updateOptionSwitches();});
			dojo.connect(cs.library,"onHideToolbar",null,function(){updateOptionSwitches();});
			
			

			
		   
		    

			
			


			
			
			
			
			
 		}
			
	});