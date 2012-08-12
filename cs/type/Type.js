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
 * CS.TYPE.TYPE - This class represents a ClickScript-Type as a wrapper around a TypeStructure to
 * handle collection facilities. The wires may have such a type as well as the component In- and Outputs
 * have. The type always refere to a TypeStructure in which the structural Information like subAttributes 
 * are stored. The type is somehow a wrapper around a TypeStructure. 
 * A Type may be the collection of a TypeStructure or simply the TypeStructure itselves
 */
	dojo.provide("cs.type.Type");
	
	dojo.require("cs.type.Structure");
	
	dojo.declare("cs.type.Type", null, {	
		
		/*
		 * True if type represents a collection
		 */
		_isCollection : false,
		
		/*
		 * Reference to the type Structure
		 */
		_structure : null,
		

		constructor: function(/* string / cs.type.Structure */ a_structure, /*optional*/ a_isCollection ){
			if(a_isCollection){
				this._isCollection = a_isCollection;
			} else {
				this._isCollection = false;
			}
			if (a_structure) {
				if (dojo.isString(a_structure)) {
					//generate a new simple Structure
					this._structure = new cs.type.Structure(a_structure);
				} else {
					this._structure = a_structure;
				}
			} else {
				throw new Error("Unproper type structure");
			}
		},
		
		
		/**
		 * Returns true if both types have the same name
		 * @param {cs.type.Type} type
		 */
		equals : function(type){
			return type && type.getName() && (type.getName() == this.getName()) && (type.isCollection() == this.isCollection());	
		},
		
		
		/**
		 * Return name of the type.
		 */
		getName : function(){
			if (this.isCollection()) {
				return "Collection<" + this._structure.getName()+ ">";
			} else {
				return this._structure.getName();
			}
		},
		
		/**
		 * Return the color of the type
		 */
		getColor : function(){
			/**
			 * todo : introduce color type to make collection visible
			 */
			if (!this.isCollection()){
				return this._structure.getColor();
			} else {
				return this._darken(this._structure.getColor(), 0.9);
			}
		},
		
		
		/**
		 * Return true if this type is a collection
		 */
		isCollection : function(){
			return this._isCollection;
		},
		
		
		/**
		 * Returns the name of the type
		 */
		toString : function(){
			return this.getName();
		},
		 
		 
		/**
		 * Returns substructure of a type
		 */	
		getStructure : function(){
			return this._structure;
		},
		
		_darken: function(a_color, a_factor){
			var color = new dojo.Color(a_color);
			var fac = a_factor;
			color.r = Math.floor(color.r*fac);
			color.g = Math.floor(color.g*fac);
			color.b = Math.floor(color.b*fac);
			return color.toHex();			
		}
	});