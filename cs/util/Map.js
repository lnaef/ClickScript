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
 * CS.UTIL.CONTAINER - Represents a map with default key-value functionality
 */
	dojo.provide("cs.util.Map");
	dojo.declare("cs.util.Map", null, {
		
		/**
		 * Object<key,value> key has type String!
		 */
		_map : null,
		
		constructor : function(){
			this._map = {};
		},
		
		/**
		 * Add a_value to the map with key: a_key
		 * The key has to be a String
		 * 
		 * @param {String} a_key
		 * @param {Object} a_value
		 */
		put : function(a_key, a_value){
			if(dojo.isString(a_key) && a_key !== ""){
				this._map[a_key] = a_value;
			} else {
				throw Error("cs.util.Map.add() : key has to be of type String and non-empty");
			}
			
		},
		
		/**
		 * True if key exists
		 * @param {String} a_key
		 */
		has : function(a_key){
			if(dojo.isString(a_key) && a_key !== ""){
				return (this._map[a_key] && true);
			} else {
				throw Error("cs.util.Map.has() : key has to be of type String and non-empty");
			}
		},
		
		/**
		 * Removes key's entry
		 * @param {String} a_key
		 */
		remove : function(a_key){
			if(dojo.isString(a_key) && a_key !== ""){
				if (this.has(a_key)) {
					return delete this._map[a_key];
				} else {
					return false;
				}
			} else {
				throw Error("cs.util.Map.remove() : key has to be of type String and non-empty");
			}
		},
		
		/**
		 * Number of Elements in the Map
		 */
		size : function(){
			var i = 0;
			for(var item in this._map){
				i++;	
			}
			return i;
		},
		
		get : function(a_key){
			if (this.has(a_key)){
				return this._map[a_key];
			} else {
				return null;
			}
		},
		
		forEach : function(a_callback, /*optional*/ a_thisObject){
			var thisObject = (a_thisObject) ? a_thisObject : dojo.global;
			for(var item in this._map){
				a_callback.call(thisObject,this._map[item],item,this);
			}
		}
	
	});
		
