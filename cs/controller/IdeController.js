/**
 * @author elcc
 * 
 * CLASS cs.controller.IdeController 
 * 
 * @description: This Class is needed to build a IDE to develop clickscripts.
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
		

 		

		constructor : function(){
 			
 			// setup basic html for ClickSciript into the HTML-Tag with id="clickscript"
 			dojo.place(
			'    	'+
			'    	<div id="csMenu">	'+
			'			<div id="csViewSwitches"></div>'+
			'			<div id="csLib"></div>'+
			'           <div id="csOptions"></div>'+
			'			<div id="csTodo"></div><div id="csExecutionView"></div>'+
			'			<div id="csActions"></div>'+
			'		</div>'+
			'		<div id="csPlayground"></div>'+
			'		<div id="csConsole"></div>'+
			'		<div id="csTutorial"></div>'+
			'		<div id="csExercise"></div>'+			
			'		<div id="footer">'+
			'			&copy; 2011 powered by lukas naef - contact\'at\'clickscript.ch - <a href="http://clickscript.ch">www.clickscript.ch</a>'+
			'		</div>'
			,dojo.byId("clickscript"));
 			
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
				    	if(on){
				    		toggler.show();
				    		dojo.addClass(toggleSwitch,"active");
				    	} else {
				    		toggler.hide();
				    		dojo.removeClass(toggleSwitch,"active");
				    	}
				    	dojo.connect(toggleSwitch,"onclick",this,function(){
				    		toggler.toggle();
				    		if(toggler.isActive()){
				    			dojo.addClass(toggleSwitch,"active");
				    			if(scroll){
						        	var node = dojo.byId(id_to_toggle);
						        	var anm = dojox.fx.smoothScroll({ node: node,
									        win:window,
									        duration:800}).play();
				    			}
				    		} else {
				    			dojo.removeClass(toggleSwitch,"active");
				    		}
				    	});	
			    	}
		    	}
		    };
		    
		    /**
		     * Place visibility switches
		     */
			if(dojo.byId("csViewSwitches")){
				out = "<ul>"+
						"<li class='first'>&nbsp;</li>" +
					  	"<li><a href='#' id='csLibSwitch' >Library</a></li>" +													// LIBRARY
						"<li><a href='#' id='csExecViewSwitch'>Execution View</a></li>" +										// EXECUTION VIEW
					  	"<li><a href='#' id='csConsoleSwitch'>Console</a></li>" +												// CONSOLE
						(cs.config.ide.optionalParts.option ? "<li><a href='#' id='csOptionSwitch'>Options</a></li>" : "") +	// OPTIONS
						(cs.config.ide.optionalParts.todo ? "<li><a href='#' id='csTodoSwitch'>Todo</a></li>":"") +				// TODO
						(cs.config.ide.optionalParts.tutorial ? "<li><a href='#' id='csTutorialSwitch'>Tutorial</a></li>":"") +// TUTORIAL
						(cs.config.ide.optionalParts.exercise ? "<li><a href='#' id='csExerciseSwitch'>Exercise</a></li>":"") +// EXERCISE
					 	"<li class='last'>&nbsp;</li>" +
					  "</ul>"+
					  '<h1 id="logo"><img src="'+cs.config.rootPath+'/util/images/logo32x32.png" alt="logo"/>&nbsp;&nbsp;ClickScript - IDE (v'+cs.config.version+')</h1>' +
					  "<p class='clear'></p>";
				dojo.place(out,dojo.byId("csViewSwitches"));
				
				/*
				 * Set toggle functionality, state and activate scrollto-option
				 */
				toggleSwitch("csLib","csLibSwitch",true);
			    toggleSwitch("csOptions","csOptionSwitch",false, true);
				toggleSwitch("csTodo","csTodoSwitch",false, true);
				toggleSwitch("csTutorial","csTutorialSwitch",false,true);
			    toggleSwitch("csExecutionView","csExecViewSwitch",true);			
				toggleSwitch("csConsole","csConsoleSwitch",false,true);
				toggleSwitch("csExercise","csExerciseSwitch",false,true);
			}
 			
 			
			/**
			 * ACTION-BAR
			 */
			var out = "";
			out += "<div id='csActionMenu'>Actions:";					
			out += "	<input onclick='location.reload(true);' type=\"button\" value=\"Clean Up\"/>";
			out += "	<input onclick='cs.executionController.run();' type=\"button\" value=\"Run\"/>";
			out += "	<input onclick='cs.executionController.repeatedRun();' type=\"button\" value=\"Repeated Run\"/>";
			out += "	<input onclick='cs.executionController.stop();' type=\"button\" value=\"Stop\"/>";
			out += "	<input onclick='cs.console.write(cs.modelController.serializeScript());' type=\"button\" value=\"Serialize\"/>"+
					"	<span id='runCounter'>0</span>"+
					"	<span class='actionLabel'> status: </span>"+
					"	<span id='csState'>" +
					"		<span title='RUN...' id='csStateRUN' style='display:none' class='csStateIcon' ></span>" +
					"		<span title='STOP...' id='csStateSTOP'  style='display:none' class='csStateIcon'></span>" +
					"		<span title='WAIT...' id='csStateWAIT'  style='display:none' class='csStateIcon'></span>" +
					"		<span title='FINISH...' id='csStateFINISH' class='csStateIcon'></span>" +
					"	</span>";
			out += "</div>";
			dojo.place(out,dojo.byId("csActions"));

			
			/**
			 * LOAD LIBRARIES
			 */
			
			// Get all loaded libraries
			var loadedComponents = cs.library.getMetaComponentsByCategory();
			
			// Prepare visibility switches for option box
			var visibilitySwitches = "<table>";
			loadedComponents.forEach(function(item,key){
				cs.library.showToolbar(key);
				visibilitySwitches += "<tr><td>"+key+"</td><td><input id='csToolbarSwitch"+ key.replace(/\./,"")+"' class='csToolbarSwitch' title='"+key+"' onchange='' type='checkbox' checked='checked'/></td></tr>";
			});
			visibilitySwitches += "</table>";
			cs.library.setLibStyle(cs.config.library.defaultStyle);
			
			



			/**
			 * LOAD CS OPTIONS
			 */
			if(cs.config.ide.optionalParts.option){
				out = "<ul id='csOptionList'>" +
					"<li><fieldset><legend>Toolbar</legend>" +
					"		<div id='csOptionToolbarVisibility'></div>" +
					"</fieldset></li>" +
					"<li><fieldset><legend>Debug</legend>" +
					"		<ul>" +
					"			<li><label for='csOptionDebugExecOnOff'>Debug Execution Mode (Worklist):</label><input type='checkbox' id='csOptionDebugExecOnOff'/></li>" +
					"			<li><label for='csOptionDebugOnOff'>Debug ClickScript Mode:</label><input type='checkbox' id='csOptionDebugOnOff'/></li>" +
					"			<li><label for='csOptionDebugDojoOnOff'>Debug DOJO Mode:</label><input type='checkbox' id='csOptionDebugDojoOnOff'/></li>" +
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
				
				// VISIBILITY SWITCHES for toolbars
				dojo.place(visibilitySwitches,dojo.byId('csOptionToolbarVisibility'));
				
				// DEBUG MESSAGES CLICKSCRIPT (on/off)
				dojo.byId("csOptionDebugOnOff").checked = cs.console.isDebug();
				dojo.connect(dojo.byId("csOptionDebugOnOff"),"onchange",this,function(){
					cs.console.setIsDebug(dojo.byId("csOptionDebugOnOff").checked);
					if(cs.console.isDebug()){
						cs.console.write("CLICKSCRIPT DEBUG MODE ON");
					} else {
						cs.console.write("CLICKSCRIPT DEBUG MODE OFF");
					}
				});
				
				// DEBUG MESSAGES DOJO (on/off)
				dojo.byId("csOptionDebugDojoOnOff").checked = dojo.config.isDebug;
				dojo.connect(dojo.byId("csOptionDebugOnOff"),"onchange",this,function(){
					dojo.config.isDebug = dojo.byId("csOptionDebugDojoOnOff").checked;
					if(cs.console.isDebug()){
						cs.console.write("DOJO DEBUG MODE ON");
					} else {
						cs.console.write("DOJO DEBUG MODE OFF");
					}
				});
				
				// EXECUTION DEBUG MODE (on/off)
				dojo.byId("csOptionDebugExecOnOff").checked = cs.executionController.getWorklist().isDebug();
				dojo.connect(dojo.byId("csOptionDebugExecOnOff"),"onchange",this,function(){
					cs.executionController.getWorklist().setIsDebug(dojo.byId("csOptionDebugExecOnOff").checked);
					if(cs.executionController.getWorklist().isDebug()){
						cs.console.write("EXECUTION DEBUG MODE ON");
					} else {
						cs.console.write("EXECUTION DEBUG MODE OFF");
					}
				});
				
				// LIBRARYSTYLE 
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
			
			if(cs.config.ide.optionalParts.tutorial){
				var url = dojo.byId("csTutorial").innerHTML;
				url = (url) ? url : cs.config.rootPath+"util/tutorial/tutorialEN.html";
				var tutorial = "<div id='csTutorialTitle'>tutorial</div><iframe src='"+url+"'/>";
				dojo.place(tutorial,dojo.byId("csTutorial"));
			}
			
			
			/**
			 * LOAD EXERCISEs
			 */
			
			if(cs.config.ide.optionalParts.exercise){
				var url = dojo.byId("csExercise").innerHTML;
				url = (url) ? url : cs.config.rootPath+"util/exercise/index.html";
				var tutorial = "<div id='csExerciseTitle'>exercises</div><iframe src='"+url+"'/>";
				dojo.place(tutorial,dojo.byId("csExercise"));
			}
			
			/**
			 * TOOLBAR actions (hide toolbar)
			 */
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