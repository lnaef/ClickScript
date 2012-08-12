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
 * cs.model.exec.Statement - This class represents ...
 */
	
	dojo.provide("cs.model.exec.Block");
	
	dojo.require("cs.util.Container");
	
	dojo.declare("cs.model.exec.Block", null, {
		
		_model : null,
		
		_components : null,
		
		/**
		 * Statement which owns this block
		 */
		_owner : null,
		
		/**
		 * True if block's is activated (is running)
		 */
		_isActive : false,
		
		/**
		 * True if block was successfully executed
		 */
		_isFinished : false,
		
		
		/**
		 * User defined function _userFinish and its caller and arguments see below
		 * used in case we don't want that block is already finished
		 */
		_onFinish : null,
		
		constructor : function(a_model, a_ownerStatement){
			// initiation of component handled by cs.model.exec.Component		
			this._model = a_model;
			this._owner = a_ownerStatement;
			
			this._isActive = false;
			this._isFinished = false;
			this._components = new cs.util.Container();	
		},
		
		/**
		 * Add an execComponent to this block
		 * @param {cs.model.exec.Component} a_component
		 */
		addComponent : function(a_component){
			
			// remove from old block
			a_component.getParent().removeComponent(a_component);
						
			// add component to block
			this._components.add(a_component);
			a_component.setParent(this);
		},
		
		/**
		 * Remove an execComponent from this block
		 * @param {cs.model.exec.Component} a_component
		 */		
		removeComponent : function(a_component){
			return this._components.remove(a_component);
		},
		
		hasComponent : function(a_component){
			return this._components.has(a_component);
		},
		
		/**
		 * Returns component container of all contained components of this block
		 */
		getComponents : function(){
			return this._components;
		},
		
		/**
		 * Executes a Block
		 */
		run: function(){
			// get all Components which are ready to be executed == all inputs are set.
			var allComponents = this.getComponents();
			
			// block has been activated
			this.setIsActive(true);
			
			allComponents.forEach(function(component){
				console.log(">",this.getModel().getMetaData().getName(),component.getModel().getMetaData().getName());
				if (component.isReadyToRun()) {
					cs.executionController.getWorklist().add(component);
				}
			},this);
			
			// if this is an empty block, we have to set it finished... 
			this.updateState();
			
		},
		
		/**
		 * switch isFinished to true in case of all contained components are finished
		 */
		updateState : function(){
			var finished = true;
			this.getComponents().forEach(function(component){
				finished = finished && component.isFinished();
			});
			if(finished){
				this.setIsFinished(true);
				
				//may be this is the last unfinished block of the statement, 
				//so the statement has also to be set to 'finished'
				this.getOwner().updateState();
			}
			/**
			 * WHAT ABOUT THE COMPONENT ? When is it also true?
			 */
		},
		
		reset : function(){
			this.setIsActive(false);
			this.setIsFinished(false);
			this.getComponents().forEach(function(component){
				component.reset();
			});
		},
		
		componentReset : function(){
			this.getComponents().forEach(function(component){
				component.componentReset();
			});			
		},
		
		/**
		 * Sets all components and itself to 'finished'
		 */
		forceFinished : function(){
			
			// has to be first action of force Finished!
			this.removeOnFinish();
			
			this.getComponents().forEach(function(component){
				component.forceFinished();
			},this);


			this.setIsFinished(true);
		},
		
		setIsFinished : function(b){
			
			if(b){
				// there is a userdefined finish for the block
				if(this._onFinish){
					this._onFinish.func.call(this._onFinish.funccaller, this._onFinish.funcargs);
				} else {
					this._isFinished = true;
					this.setIsActive(false);
				}
			} else {
				this._isFinished = false;
			}
		},
			
		isFinished : function(){return this._isFinished;},
		
		setIsActive : function(b){
			if(b && this.isFinished()){
				throw Exception("You try to set a component active but component already finished!");
			}
			this._isActive = b;
		},
		isActive : function(){return this._isActive;},
		
		/**
		 * its only possible to set one argument (otherwise make an object)
		 */
		setOnFinish : function(a_func,a_caller,a_argument){
			this._onFinish = {func : a_func,
							  funccaller : a_caller,
							  funcargs : a_argument};
		},
		
		removeOnFinish : function(){
			this._onFinish = null;
		},
		
		getModel : function(){
			return this._model;
		},
		
		getOwner : function(){
			return this._owner;
		}
	});
