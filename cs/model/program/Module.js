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
 * cs.model.program.Module - This class represents a Module Component with its inputs, outputs and fields
 * each module has also a link to a metadata object with its type specific information. 
 */
	
	dojo.provide("cs.model.program.Module");
	
	dojo.declare("cs.model.program.Module", cs.model.program.Component, {
		
	
		serialize : function(){

			// call serialize on superclass
			// @todo if only this, we can remove whole function
			return this.constructor.superclass.serialize.call(this); 
			
		}
	});