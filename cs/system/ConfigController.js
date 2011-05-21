	dojo.provide("cs.system.ConfigController");
	
	/*
	 * The ConfigController loads all Configs and global Variables
	 * You have to load this Class first.
	 */
	
    // init global variables
    window.cs.modelController = null;
	window.cs.viewController = null;	
	window.cs.config = null;
	window.cs.ide = null;
	window.cs.componentContainer = [];
	
	/**
	 * Set global configs
	 */ 
	cs.config = {
		
		// Path for the ClickScript class folder
		rootPath : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ),
 		
 		// Playground Dimensions
 		playgroundWidth : 1000,	
 		playgroundHeight : 500,
 		
 		// Debug-Mode in ClickScript console?
 		isDebug : true,
 		
 		// Debug-Mode for dojo overwrite (Loading of Dojo is set by the loading-options of Dojo)
 		isDojoDebug : true,
	};		
	
	/**
	 * Set global ClickScript IDE
	 */
	cs.ide = {
		
		/**
		 * Initialize the ClickScript IDE. You can use this function
		 * to setup an ClickScript IDE. At the beginning of a project.
		 */
		init : function(){
 			window.cs.ide = new cs.controller.IdeController();
		}
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
	//dojo.config.isDebug = cs.config.isDojoDebug;

	
	
 	dojo.declare("cs.system.ConfigController", null, {
 		
	});