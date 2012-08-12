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

dojo.provide("cs.lib.converter.init");

// add test module
cs.componentContainer.push({
	name : "cs.converter.num2str",
	description : "TEXT is the converted NUMBER to text",
	inputs : [
		{
			name: "NUMBER",
			type: cs.library.getType("cs.type.Number")
		}],
	outputs:  [{
			name: "TEXT",
			type: cs.library.getType("cs.type.String")
			}],
	image : "converter/Num2Str.png",
	exec: function(state){
		var number = state.inputs.item(0).getValue();
		state.outputs.item(0).setValue(number+"");
	}
});


cs.componentContainer.push({
	name : "cs.converter.str2num",
	description : "This module converts the TEXT to a number NUMBER. If input is not a number, output will be -1",
	inputs : [
		{
			name: "TEXT",
			type: cs.library.getType("cs.type.String")
		}],
	outputs:  [{
			name: "NUMBER",
			type: cs.library.getType("cs.type.Number")
			}],
	image : "converter/Str2Num.png",
	exec: function(state){
		var text = state.inputs.item(0).getValue();
		var result = -1;
		if(text.match(/^[0-9]*(\.[0-9]*)?$/)){
			result = parseFloat(text);
		}
		state.outputs.item(0).setValue(result);
	}
});
