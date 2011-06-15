	dojo.provide("cs.system.ConfigController");
	
	/*
	 * The ConfigController loads all Configs and global Variables
	 * You have to load this Class first.
	 */
	
    // init global variables
    window.cs.modelController = null;
	window.cs.viewController = null;	
	window.cs.config = null;
	window.cs.componentContainer = [];
	
	/**
	 * Set global configs
	 */ 
	cs.config = {
		
		// Version
		version : "0.5 BETA",
		
		// Path for the ClickScript class folder
		rootPath : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ),
 		
 		// Debug-Mode in ClickScript console?
 		isDebug : true,
 		
 		// Debug-Mode for dojo overwrite (Loading of Dojo is set by the loading-options of Dojo)
 		isDojoDebug : true,
 		
 		// Get the custom modules and classes to firebug!
 		isDojoDebugAtAllCosts : true,
 		
 		/**
 		 * IDE configuration
 		 */
 		ide : {
 			// Are the following parts visible in the IDE?
 			optionalParts : { 
 				option: true,
 				todo: true,
 				tutorial: true,
 				exercise: true
 			}
 		},
 		
 		/**
 		 * Preset useraccounts
 		 */
 		accounts : [
 			{guid:"cee32852-0b7f-6ec4-79c7-7a626320834e",token:"3340f6ecf19382147132a6043b3381d3",name:"elcc"},
 			{guid:"b8e23e6d-efaf-5da4-e179-548617c6ebc9",token:"dfaafb798a725934ade3156a8466e2e9",name:"lukas"}
 		],
 		
 		/**
 		 * PLAYGROUND configuration
 		 */ 
 		playground : {
 			width : 1000, // Dimensions	
 			height : 500
 		},
 		
 		
 		/**
 		 * LIBRARY configuration
 		 */
 		library : {
 			defaultStyle : 1 // 1 (small icons), 2, 3 (big icons, name)
 		},
 		
 		util : {
 			doPoint : function(a_x,a_y){
				cs.viewController.getSurface().createRect({
					x : a_x-2,
					y : a_y-2,
					width : 4,
					height : 4,
					r : 1
				}).setFill(cs.view.program.Block.dim.fill).setStroke(cs.view.program.Block.dim.stroke);
			}
 		}
 		
	};		
	
	cs.global = {
		
			/**
			 * Set global ClickScript IDE
			 */
		ide : {
		
			/**
			 * Initialize the ClickScript IDE. You can use this function
			 * to setup an ClickScript IDE. At the beginning of a project.
			 */
			init : function(){
	 			window.cs.global.ide = new cs.controller.NewIdeController();
			},
			

		},
		
		/**
		 * Gets initialized later
		 * {cs.system.Serializer.js}
		 */
		serializer : null,

		/**
		 * Gets initialized later
		 * {cs.system.ScriptPlayer.js}
		 */		
		scriptPlayer : null
		
	}
	

	
	
	/**
	 * Initialize ComponentContainer. Every Component you add to this
	 * List will be added dynamically to the IDE if you start it
	 */
	
	/* 
	 * @depricated: use cs.componentContainer instead
	 * todo: delete
	 */
	if(!window.csComponentContainer){
		window.csComponentContainer = [];
	}
	
	/*
	 * set dojo debug mode
	 */
	dojo.config.isDebug = cs.config.isDojoDebug;
	dojo.config.debugAtAllCosts = cs.config.isDojoDebugAtAllCosts;
	

	
 	dojo.declare("cs.system.ConfigController", null, {
 		
	});