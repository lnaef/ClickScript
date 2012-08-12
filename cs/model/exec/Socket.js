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
 * CS.MODEL.EXEC.SOCKET - This class represents a Socket 
 */
	dojo.provide("cs.model.exec.Socket");
	
	dojo.require("cs.util.Container");
	
	dojo.declare("cs.model.exec.Socket", null, {
		
		/**
		 * all connected connectedSocketss to this Socket
		 * @type : cs.util.Container
		 */
		_to : null,

		/**
		 * Model of this socket
		 */
		_model : null,
		
		
		/**
		 * Owner component of this Socket
		 * @type cs.model.exec.Component
		 */
		_owner : null,
		
		
		/**
		 * create an exec socket
		 * @param {cs.model.program.Socket} a_model
		 * @param {cs.model.exec.Component} a_owner
		 */
		constructor : function(a_model,a_owner){
			this._connectedSockets = new cs.util.Container();
			this._model = a_model;
			this._owner = a_owner;
		},
		
		/**
		 * Connects this socket to an other one
		 * @param {cs.model.exec.Socket} a_exec_socket
		 */
		connectTo : function(a_exec_socket){
			this._connectedSockets.add(a_exec_socket);
		},
		
		getConnectedSockets : function(){
			return this._connectedSockets;
		},
		
		/**
		 * Removes a connection to a socket
		 * @param {cs.model.exec.Socket} a_exec_socket
		 */
		removeConnection : function (a_exec_socket){
			this._connectedSockets.remove(a_exec_socket);
		},
		
		/**
		 * Return the model to this socket
		 */
		getModel : function(){
			return this._model;
		},
		
		/**
		 * Returns the value of an outputSocket or the connected
		 * outputSocket in case of this is an inputSocket
		 */
		getValue : function(){
			throw Error("Has to be overwritten: Socket > getValue()");
		},
		
		/**
		 * Return true if a value is set on the "wire"
		 */		
		hasValue : function(){
			return this.getValue() !== null;
		},
		
		/**
		 * Owner component of this socket
		 */
		getOwner : function(){
			return this._owner;
		}
				
	});
	

