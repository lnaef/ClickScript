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
 * CS.MODEL.meta.MetaBlock - This class represents the metadata about a block. 
 * 
 * 
 */
	dojo.provide("cs.model.meta.MetaBlock");

	dojo.require("cs.util.Container");

	dojo.declare("cs.model.meta.MetaBlock", null, {
		
		_name : null,
		
		constructor : function(a_data){
			if (a_data.name) {
				this._name = a_data.name;
			} else {
				throw Error("metablock needs at least a name!");
			}
		},
		
		/**
		 * Getters
		 */
		getName : function(){return this._name;}
	});