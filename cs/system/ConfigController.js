/**
 * ClickScript - ClickScript is a visual programming language. This is a 
 * data flow programming language running entirely in a web browser.
 * Copyright (C) 2012 Lukas Naef
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * @author: elcc
 */
	dojo.provide("cs.system.ConfigController");
	
	/*
	 * The ConfigController loads all Configs and global Variables
	 * You have to load this Class first.
	 */
	
    // init global variables
    window.cs.modelController = null;
	window.cs.viewController = null;	
	window.cs.config = null;
	
	/* 
	 * @depricated: use cs.componentContainer instead
	 * todo: delete
	 */
	window.cs.componentContainer = [];
	
	/**
	 * Set global configs
	 */ 
	cs.config = {
		
		// Version
		version : "0.5 BETA",
		
		// Path for the ClickScript class folder
		rootPath : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ),
		
		// Online-Services root-path
		//rootServices : "http://clickscript.ch/services",
		rootServices : "http://localhost/clickscript_server/services",

		
		// Debug-Mode in ClickScript console?
		isDebug : true,
		
		// Debug-Mode for dojo overwrite (Loading of Dojo is set by the loading-options of Dojo)
		isDojoDebug : true,
		
		// Get the custom modules and classes to firebug!
		isDojoDebugAtAllCosts : true,
		
		/**
		 * Preset useraccounts
		 */
		accounts : [
			{ username:"online", token:"10425501" },
			{ username:"test", token:"d10a2825" }
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
				window.cs.global.ide = new cs.controller.IdeController();
			}
			

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
		
	};

	
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