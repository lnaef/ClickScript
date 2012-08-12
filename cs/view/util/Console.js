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
 */
	dojo.provide("cs.view.util.Console");


	dojo.declare("cs.view.util.Console", cs.util.Reader, {
	
		/**
		 * HTML console node
		 */
		_node : null,
		
		/**
		 * Console text
		 */
		_text : null,
	
		constructor : function(a_reader_constructor,a_id,/*optional*/a_style){
			
			this._value = "";
			this._text = "";
			
			var style = cs.util.makeParameters(cs.view.util.Console.style,a_style);
			
			dojo.byId(a_id).innerHTML = "<div id='"+a_id+"csConsole'></div>";
			this._node = dojo.byId(a_id+"csConsole");	
			
			dojo.style(this._node,style);
		},
		
		updateText : function(a_text, a_cursor_isActive){
			this._node.innerHTML = a_text + (a_cursor_isActive ? cs.view.util.Console.cursor : "");
		},
		
		/**
		 * Fired after pressing ENTER or Abort with CTRL+C
		 * If it is an abort the value will be an empty string
		 * @param {String} a_value The entered word
		 */
		onAfterReading : function(a_value){
			this.print(a_value);
		},
		
		/**
		 * Fired after pressing CTRL+C
		 */
		onAbortReading : function(a_value_before_abort){
			this.println("aborted input");
		},
		
		/**
		 * overwritten read function because old values habe to be stored in the fix prefix
		 * @param {Object} a_tmpPrefix
		 */
		read : function(a_tmpPrefix){
			
			this.println("");
			
			// do read of cs.util.Reader class
			this.inherited(arguments);
			
			// clean up for console behaviour
			this.setPrefix(this.getPrefix()+this._tmpPrefix);
			this._tmpPrefix = "";
			
		},
		
		print : function(a_text){
			if (!this.isReading()) {
				this.setPrefix(this.getPrefix() + a_text);
				this.write();
			}
		},
		
		println : function(a_text){
			this.print((this.getPrefix().length>0?"<br/>":"") + a_text);	
		}
		
	});
	
	cs.view.util.Console.style = {
		fontFamily : "Courier",
		overflowY : "scroll",
		width : 500,
		height : 100,
		backgroundColor : "#000",
		color : "#fff",
		display : "block",
		padding : 5,
		margin: 0
	};
	
	cs.view.util.Console.cursor = "<img src='"+cs.config.rootPath+"/view/util/img/cursor.gif'/>";
