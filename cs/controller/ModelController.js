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
 */
	
	dojo.provide("cs.controller.ModelController");
	
	dojo.require("cs.model.program.Component");
	dojo.require("cs.model.program.Statement");
	dojo.require("cs.model.program.Block");
	dojo.require("cs.model.program.Wire");
	
	dojo.declare("cs.controller.ModelController", null, {
		
		/**
		 * Root program statement
		 */
		_rootStatement : null,
		
		
		/**
		 * Block of this._rootStatement
		 */
		_rootBlock : null, /* statement?*/
		
		/**
		 * Observers to this model
		 * @type: cs.util.Container
		 */
		_observers : null,
		
		
		constructor : function(){
			this._rootStatement = cs.library.getNewStatement("cs.statement.program");
			
			this._rootBlock = this._rootStatement.getBlock(0);
			this._observers = new cs.util.Container();
		},
		
		addComponent : function(a_component_type_name, a_position_program, a_position_exec){
			/*
			 * TODO put module to the right subblock
			 */
			var component = null;
			if(cs.library.hasStatement(a_component_type_name)){
				component = cs.library.getNewStatement(a_component_type_name);	
			} else if(cs.library.hasModule(a_component_type_name)){
				component = cs.library.getNewModule(a_component_type_name);				
			} else {
				throw Error("Unknown component: '" + a_component_type_name +"'");
			}

			component.setPositionProg(a_position_program.x,a_position_program.y);
			if(component.getMetaData().hasView()){
				component.setPositionExec(a_position_exec.x,a_position_exec.y);
			}
			
			this._rootBlock.addComponent(component);
			
			console.log("MODEL-CONTROLLER: Added Component of type: "+a_component_type_name);
			this.onAddComponent(component);
			return component;
		},
		
		/**
		 * Moves a module to another block
		 * @param {Object} a_component
		 * @param {Object} a_toBlock
		 */
		moveComponentToBlock : function(a_component,a_toBlock){
			// only move if source and target are different blocks!
			if (!a_component.hasParentBlock() || (a_component.getParentBlock() != a_toBlock)) {
				if (a_component.hasParentBlock()) {
					// remove module from the old block
					a_component.getParentBlock().removeComponent(a_component);
				}
				
				// add module to the new block
				a_toBlock.addComponent(a_component);
				
				this.onMoveComponentToBlock(a_component, a_toBlock);
			}
		},
		
		/**
		 * Connects to Sockets
		 * @param {cs.model.program.Socket} a_socket1
		 * @param {cs.model.program.Socket} a_socket2
		 * @return {cs.model.program.Wire} The connecting Wire
		 */
		connectSockets : function(a_socket1, a_socket2){
			var wire = new cs.model.program.Wire();
			
			wire.connectFROM(a_socket1);
			wire.connectTO(a_socket2);
			
			this.onConnectSockets(wire, a_socket1,a_socket2);
			return wire;
		},
		
		/**
		 * Deletes module and all it connected wires
		 * @param {Object} a_module
		 */
		deleteComponent : function(a_component){
			console.log("DATAMODEL: REMOVE COMPONENT");
			a_component.destroy();
		},
		
		/**
		 * Removes wire from the model
		 * @param {cs.model.program.Wire} a_wire
		 */
		deleteWire : function(a_wire){
			a_wire.destroy();	
		},
		
		updateFieldSocket : function(a_value_socket,value){
			a_value_socket.setValue(value);
			this.onUpdateFieldSocket(a_value_socket);
		},
		
		updatePositionProg : function(a_module, a_x, a_y){
			a_module.setPositionProg(a_x,a_y);
			this.onUpdatePositionProg(a_module,a_x,a_y);
		},
		
		updatePositionExec : function(a_module, a_x, a_y){
			a_module.setPositionExec(a_x,a_y);
			this.onUpdatePositionExec(a_module);
		},
		
		updateBlockDimension : function(a_block, a_dimension){
			a_block.setDimension(a_dimension);
			this.onUpdateBlockDimension(a_block);
		},		
		
		focusComponent : function(a_model_component){
			this.onFocusComponent(a_model_component);
		},
		
		blurComponent : function(a_model_component){
			this.onBlurComponent(a_model_component);
		},
		
		updateData : function(a_module, a_data){
			//whats this? field?
		},
		
		serializeScript : function(){
			return cs.global.serializer.serialize('clickscript',{'version':cs.config.version},this._rootStatement.serialize());
		},
		
		onAddComponent : function(a_model_module){
			
		},
		
		onConnectSockets : function(a_model_wire, a_model_socket_from, a_model_socket_to){
			
		},
		
		onDeleteWire : function(a_model_wire,from,to){

		},
		
		onDeleteComponent : function(a_model_component){
			
		},
		
		onUpdateFieldSocket : function(a_model_value_socket){
			
		},
		
		onUpdatePositionProg : function(a_model){
			
		},
		
		onUpdatePositionExec : function(a_model){
			
		},
		
		onMoveComponentToBlock : function(a_model_component, a_model_block){
			
		},
		
		onFocusComponent : function(a_model_component){
			
		},
		
		onBlurComponent : function(a_model_component){
			
		},
		
		registerObserver : function(a_observer){
			dojo.connect(this,"onAddComponent",a_observer,"onAddComponent");
			dojo.connect(this,"onConnectSockets",a_observer,"onConnectSockets");
			dojo.connect(this,"onDeleteWire",a_observer,"onDeleteWire");
			dojo.connect(this,"onDeleteComponent",a_observer,"onDeleteComponent");
			dojo.connect(this,"onUpdateFieldSocket",a_observer,"onUpdateFieldSocket");
			dojo.connect(this,"onUpdatePositionProg",a_observer,"onUpdatePositionProg");
			dojo.connect(this,"onUpdatePositionExec",a_observer,"onUpdatePositionExec");
			dojo.connect(this,"onUpdateBlockDimension",a_observer,"onUpdateBlockDimension");
			dojo.connect(this,"onMoveComponentToBlock",a_observer,"onMoveComponentToBlock");
			dojo.connect(this,"onFocusComponent",a_observer,"onFocusComponent");
			dojo.connect(this,"onBlurComponent",a_observer,"onBlurComponent");
			this._observers.add(a_observer);
		},
		
		getRootBlock : function(){
			return this._rootBlock;
		},
		
		getRootStatement : function(){
			return this._rootStatement;
		}
		
	});