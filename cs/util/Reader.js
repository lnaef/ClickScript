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
 * CS.UTIL.READER - This class represents a reader which is registered to the onkeypress event of the document.
 * in case of overwriting the write() function you can define what the reader should do on writing.
 * 
 * The argument of the constructor may be an object like defaultReader (see bottom of this file for default)
 * 
 * {
		cursorSrc : './lib/dojo/cs/view/util/img/cursor.gif',  //img to a cursor source
		value : "",									   //predefined read value
		prefix : ""											   //prefix of reading e.g. "your name: "
	};
	
	CONTROLL:
	  ENTER - finished reading > onAfterReading event gets fired
	  ESCAPE or Ctrl+c - abort reading
 */
	dojo.provide("cs.util.Reader");

	dojo.require("cs.util._base");

	dojo.declare("cs.util.Reader", null, {
		
		/**
		 * True if console is in reading mode
		 */
		_isReading : false,
		
		/**
		 * Text read so far
		 */
		_value:null,
		
		/**
		 * Connection on reading
		 */
		_readConn : null,
	
		/**
		 * Source path to a cursor
		 */
		_cursorSrc : null,
		
		/**
		 * Fix prefix befor value
		 */
		_prefix : null,
		
		/**
		 * Temp prefix (set by the read() function
		 */
		_tmpPrefix : null,
		
		/**
		 * Creates a Reader object
		 * @param {cs.util.defaultReader} a_reader see on top for description
		 */
		constructor : function(a_reader){			
			var reader = cs.util.makeParameters(cs.util.defaultReader,a_reader);
			this._cursorSrc = reader.cursorSrc;
			this.setValue(reader.value);
			this._prefix = reader.prefix;
			this._tmpPrefix = "";
		},
		
		/**
		 * Write text dependend on the state of isReading it will draw the cursor
		 */
		write : function(){			
				this.updateText(this._prefix + this._tmpPrefix + this._value,this.isReading());
		},
		
		/**
		 * TOBE OVERWRITTEN!
		 * @param {String} a_text         text to read
		 * @param {Boolean} activateCursor cursor should appear
		 */
		updateText : function(a_text,activateCursor){
			throw Error("You have to overwrite this function!");
		},
		
		/**
		 * Start reading
		 * @param {String} a_text optional temp prefix
		 */
		read : function(/*optional*/a_text){
			this._isReading = true;
			
			this._tmpPrefix = a_text ? a_text : "";
			
			this.write();
			
			this._readConn = dojo.connect(dojo.doc,"onkeypress",this,"onreadletter");			
		},
		
		_deleteChar : function(){
			if (this._value.length > 0) {
				this.setValue(this._value.substring(0, this._value.length - 1));
				this.write();
			}
		},
		
		
		isReading : function(){
			return this._isReading;
		},
		
		/**
		 * If this.isReading() and on key pressed we would like to read
		 * @param {Object} event
		 */
		onreadletter : function(event){
	        var key = event.keyCode;
			var character = event.keyChar;
			
			// ABORT READING IF CTRL + C
			if ((character == "c" || character == "C") && event.ctrlKey || key == dojo.keys.ESCAPE) {
				this.abort();
			} else {
				
			// STOP READING IF ENTER
			if (key == dojo.keys.ENTER) {
				this.stop();		
				
			}
			else {
			
			// DELETE LAST CHAR IF BACKSPACE	
			if (key == dojo.keys.BACKSPACE) {
				
				// delete last char
				this._deleteChar();
								
			}
			
			// READ OTHERWISE
			else {
				// User pressed any key write it to console and store it
				this.setValue(this._value + character);
				this.write();
			}
			}
			}	
			
			// stop bubbeling because of ie back functionality
			// or the space and enter select property on buttons
			if ((key == dojo.keys.ENTER) || key == dojo.keys.BACKSPACE || key == dojo.keys.SPACE) {
				dojo.stopEvent(event);
			}
		},
		
		/**
		 * Abort reading
		 */
		abort : function(){
			var readvalue = this._value;
			
			// clean up
			this._stopReading();
			
			// fire event onAbortReading
			this.onAbortReading(readvalue);
		},
		
		/**
		 * Stop reading and 
		 */
		stop : function(){
			if (this.isReading()) {
				// fire event onAfterReading
				var readvalue = this._value;
				
				// clean up
				this._stopReading();
				
				// at the end we fire the event
				this.onAfterReading(readvalue);
			}	
		},
		
		/**
		 * Fired after pressing ENTER or Abort with CTRL+C
		 * If it is an abort the value will be an empty string
		 * @param {String} a_value The entered word
		 */
		onAfterReading : function(a_value){
			
		},
		
		/**
		 * Fired after pressing CTRL+C or ESCAPE
		 */
		onAbortReading : function(a_value_till_abort){
			
		},
		
		/**
		 * Stop the reading process and clean up
		 */
		_stopReading : function(){
				this._isReading = false;
				dojo.disconnect(this._readConn);
				
				// write without cursor
				this.write();	
				
				// reset
				this.setValue("");
				this._tmpPrefix = "";
						
		},
		
		getValue : function(){
			return this._value;
		},
		
		setValue : function (a_text){
			this._value = a_text;
		},
		
		getPrefix : function(){
			return this._prefix;
		},
		
		setPrefix : function(a_text){
			this._prefix = a_text;
		}
		
	});
	
	cs.util.defaultReader = {
		cursorSrc : cs.config.rootPath + 'view/util/img/cursor.gif',
		value : "",
		prefix : ""
	};
	
