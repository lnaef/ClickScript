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
	dojo.provide("cs.view.util.EasyConsole");


	dojo.declare("cs.view.util.EasyConsole", null, {
	
		/**
		 * HTML console node
		 */
		_node : null,
		
		/**
		 * Console text
		 */
		_text : null,
		
		/**
		 * Debug mode on/off
		 */
		_isDebug : false,
	
		constructor : function(a_id,/*optional*/a_style){
			
			this._text = "";
			
			var style = cs.util.makeParameters(cs.view.util.EasyConsole.style,a_style);
			
			// get node for console
			this._node = dojo.byId(a_id);	
			
			// set style
			dojo.style(this._node,style);
		},
		
		/**
		 * Write a_text to console
		 * @param {String} a_text
		 */
		write : function(a_text,a_not_html_encode){
			if(!a_not_html_encode){
				this._text += a_text.replace(/  /g, "&nbsp;&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")+"<br/>";
			} else {
				this._text += a_text.replace(/  /g, "&nbsp;&nbsp;")+"<br/>";	
			}
			this._node.innerHTML = this._text;
		},
		
		/**
		 * Write a_text to console if this.debug is true
		 * @param {String} a_text
		 */
		writeDebug : function(a_text){
			if(this._isDebug){
				this.write(a_text);
			}
		},
		
		
		/**
		 * Write a_text to console as Error
		 * @param {String} a_text
		 */
		writeError : function(a_text){
			var text = "<font color='red' class='errormessage'><strong>/**<br/>&nbsp;* ERROR<br/>&nbsp;**/<br/></strong></font>";
				this.write(text+a_text.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"<br/>",true);
			
		},
		
		
		
		/**
		 * Enable or disable the debug mode
		 */
		setIsDebug : function(b){
			this._isDebug = b;
		},
		
		
		isDebug : function(){
			return this._isDebug;
		},
		
		getNode : function(){
			return this._node;
		}
	});
	
	cs.view.util.EasyConsole.style = {
		fontFamily : "Monospace",
		overflowY : "scroll",
		overflowX : "hidden",
		backgroundColor : "#000",
		color : "#fff",
		display : "block"
	};
	