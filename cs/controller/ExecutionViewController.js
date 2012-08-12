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
 * @author lnaef
 * 
 * CS.CONTROLLER.EXECUTIONVIEWCONTROLLER - This class represents a view controller for the execution view
 * 
 */
	
	dojo.provide("cs.controller.ExecutionViewController");
	
	dojo.require("cs.util.Container");
    dojo.require("dojo.fx");
    dojo.require("dojo.dnd.move");
    dojo.require("cs.view.exec.Component");

	
	dojo.declare("cs.controller.ExecutionViewController", null, {
		
		/**
		 * name of the raw node (where to put the execution View)
		 */
		_nodeName : "csExecutionView",
		
		/**
		 * dom node
		 */
		_rawNode : null,
		
		/**
		 * dome node for components (inside the rawNode)
		 */
		_playground : null,
		
		
		/**
		 * container of all components
		 */
		_components : null,
		
		/**
		 * needed for show and hide the view
		 */
		_toggler : null,
		
		constructor : function(){
			
			// use id="csExecutionView" as rawNode
		    // generate id="csExecutionViewPlayground" for components
			this._rawNode = dojo.byId(this._nodeName);
			if(!this._rawNode){
				throw Error("missing <div id='csExecutionView'... for execution view");
			}
			this._rawNode.innerHTML = "<div id='csExecutionViewContainer'><div id='csExecutionViewTitle'>execution view</div><div id='csExecutionViewPlayground'></div></div>";
			
			this._playground = dojo.byId("csExecutionViewPlayground");

			// init component container
			this._components = new cs.util.Container();
			
			this._toggler = new dojo.fx.Toggler({
		       node: this._rawNode,
		       showFunc: dojo.fx.wipeIn,
		       hideFunc: dojo.fx.wipeOut
		     });

		},
		/**
		 * creates a execution view component from meta data and add's a_component to the execution view
		 * @returns cs.view.exec.Component 
		 */
		addComponent : function(a_component_program_model){

			
			// create new execution view component from meta view component
			var viewComponent = new cs.view.exec.Component(a_component_program_model,this._playground);
 
			
			// add view component to components container
			this._components.add(viewComponent);
			
			return viewComponent;
		},
		
		/**
		 * show the execution view
		 */
		show : function(){
			this._toggler.show();
		},
		
		/**
		 * hide the execution view
		 */
		hide : function(){
			this._toggler.hide();
		},
		
		setWidth : function(a_width){
			dojo.style(dojo.byId(this._nodeName),"width",a_width);
		},
		
		setHeight : function(a_height){
			dojo.style(dojo.byId(this._nodeName),"height",a_height);
		}
	});