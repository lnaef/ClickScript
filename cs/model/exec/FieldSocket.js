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
 * CS.MODEL.EXEC.OUTPUTSOCKET - This class represents a Socket on which we store the value on runtime.
 * 
 * TODO: REDESIGN OF field > RENAME TO FIELD AND REMOVE FROM SOCKETDESIGN AT ALL!
 */
	dojo.provide("cs.model.exec.FieldSocket");
	
	dojo.require("cs.model.exec.Socket");
	
	dojo.declare("cs.model.exec.FieldSocket", null, {

		_model : null,

		constructor : function (a_model){
			this._model = a_model;
		},
		
		getModel : function(){
			return this._model;
		},
		/**
		 * Get value of field socket
		 */
		getValue : function(){
			return this.getModel().getValue();
		}
	});
	

