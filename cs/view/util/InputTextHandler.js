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
 * CS.VIEW.UTIL.INPUTTEXTHANDLER - represents a shape with functionality like an input field in html
 */
	dojo.provide("cs.view.util.InputTextHandler");

	dojo.require("cs.util.Reader");

	dojo.declare("cs.view.util.InputTextHandler", cs.util.Reader, {
	
		/**
		 * HTML console node
		 */
		_shape : null,
	
		constructor : function(a_reader_constructor, a_shape){
			this._shape = a_shape;
			this.setValue(a_shape.getShape().text);
		},
		
		/**
		 * Change text to a_text and show '<' if cursor is activated
		 * @param {String} a_text
		 * @param {Boolean} a_cursor_isActive
		 */
		updateText : function(a_text, a_cursor_isActive){
			// update text and redraw
			var shape = dojo.clone(this._shape.getShape());
			shape.text = a_text + (a_cursor_isActive?"<":"");
			this._shape.setShape(shape);
		},
		
		getShape : function (){
			return this._shape;
		},
		
		focus : function(){
			
			// focus on main window 
			// usefull if we work with iframes and focus is on them
			window.focus();
			
			// remove all possible focused input fields
			dojo.query('input').forEach(function(item){
				item.blur();
			});

		},
		
		/**
		 * Fired after pressing ENTER or Abort with CTRL+C
		 * If it is an abort the value will be an empty string
		 * @param {String} a_value The entered word
		 */
		onAfterReading : function(a_value){
			this.setValue(a_value);
			this.setPrefix("");
		},
		
		/**
		 * Fired after pressing CTRL+C
		 */
		onAbortReading : function(a_value_before_abort){

		}
		
	});
