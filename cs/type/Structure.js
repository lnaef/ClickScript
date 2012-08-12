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
 * CS.TYPE.TYPE - This class represents a ClickScript-TypeStructure. Needed for the class cs.type.Type
 * as the structural component of a type. The structure always has a type name. The type may consist of a few attributes e.g.
 *    cs.type.custom.Letter:
 *      - name : "cs.type.String"
 *      - prename : "cs.type.String"
 *      - plz : "cs.type.Number"
 *      
 */
	dojo.provide("cs.type.Structure");
	//statically loaded dojo.require("cs.type.Controller");	

	dojo.declare("cs.type.Structure", null, {

		/**
		 * Container for the attributes of the type
		 */
		_attributes : null,
		
		/**
		 * unique name of this typestructure
		 */
		_name : null,
		
		/**
		 * color of the type
		 */
		_color : null,
		
		constructor : function(a_name,a_color){
			this._attributes = [];
			this._name = a_name;
			this._color = (a_color) ? a_color : "#ccc";
		},
		
		/**
		 * Adds (a_name, a_type) tuple to the substructure
		 * @param {String} a_name
		 * @param {cs.type.Type} a_type_name
		 */
		addAttribute : function(a_name,a_type){
			this._attributes[a_name] = a_type;
		},
		
		/**
		 * Returns the typeStructure as String
		 */
		toString : function(){
			var output = this._name + ((this._attributes.length>0)?"{":"");
			for(var item in this._attributes){
				output = output +" " +item + ":" + this._attributes[item]+",";
			}
			return output + ((this._attributes.length>0)?"}":"");
		},
		
		/**
		 * Return the name of the type
		 */
		
		getAttributes : function(){
			return this._attributes;
		},
		
		getName : function(){
			 return this._name;
		},
		
		getColor : function(){
			return this._color;
		},
		
		getSize: function(){
			var i = 0;
			for(x in this._attributes){i++;}
			return i;
		},
		
		getAttribute: function(a_name){
			return this._attributes[a_name];
		}
		
	});
		