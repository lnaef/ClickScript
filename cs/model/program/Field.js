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
 * CS.MODEL.PRORGRAM.FIELD- This class represents a Field of a Module, like field Sockets.
 * It is quiet the same like a socket but also has its own value.
 */
	dojo.provide("cs.model.program.Field");
	
	dojo.require("cs.model.program.Socket");
	
	dojo.declare("cs.model.program.Field", cs.model.program.Socket, {
		
		_value : null,

		constructor: function(a_metaSocket,a_component,a_value){
			//init of a_metaSocket and a_component done by superclass cs.model.program.Socket
			if(a_metaSocket.getMode() != cs.model.meta.MetaSocket.MODE_INPUT_FIELD){
				throw Error("mode has to be cs.model.meta.MetaSocket.MODE_INPUT_FIELD");
			}
			this.setValue(a_value ? a_value : "");
		},
		
		setValue : function(a_value){
			this._value = a_value;
		},
		
		getValue : function(){
			return this._value;
		},
		
		serialize : function(){
			return cs.global.serializer.serialize('field',{'uid':this.getUid(),'value':this.getValue()});
		}
		
	});
