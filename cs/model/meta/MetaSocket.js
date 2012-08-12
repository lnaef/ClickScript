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
 * CS.MODEL.meta.MetaSocket - This class represents the metadata about a socket. 
 * 
 * 
 */
	dojo.provide("cs.model.meta.MetaSocket");

	dojo.require("cs.util.Container");

	dojo.declare("cs.model.meta.MetaSocket", null, {
		
		_name : null,
		
		_type : null,
		
		_mode : null,
		
		_position : null,
		
		constructor : function(a_name, a_type, a_mode, a_position){
			this._name = a_name;
			this._type = a_type;
			this._mode = a_mode;
			this._position = a_position;
		},
		
		/**
		 * Mode checkers
		 */
		isInput        : function(){ return this._mode == cs.model.meta.MetaSocket.MODE_INPUT;},
		isOutput       : function(){ return this._mode == cs.model.meta.MetaSocket.MODE_OUTPUT;},
		isField : function(){ return this._mode == cs.model.meta.MetaSocket.MODE_INPUT_FIELD;},	
			
		/**
		 * Getters
		 */
		getName : function(){return this._name;},
		getType : function(){return this._type;},
		getMode : function(){return this._mode;},
		getPosition : function(){return this._position;}

	});
	
	cs.model.meta.MetaSocket.MODE_UNDEFINED = 0;
	cs.model.meta.MetaSocket.MODE_INPUT = 1;
	cs.model.meta.MetaSocket.MODE_OUTPUT = 2;
	cs.model.meta.MetaSocket.MODE_INPUT_FIELD = 3;