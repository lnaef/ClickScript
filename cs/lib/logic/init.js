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

dojo.provide("cs.lib.logic.init");

	cs.componentContainer.push({
		name : "cs.logic.random",
		description : "This module generates a randoized true and false values ",
		inputs : 
			[],
		outputs:  
			[{
				name: "RANDOM",
				type: "cs.type.Boolean"
			}],
		image: "logic/random.png",
		exec : function(state){
			var rand = Math.random() > 0.5;
			state.outputs.item(0).setValue(rand);
		}
	});


	cs.componentContainer.push({
		name : "cs.logic.and",
		description : "True if BOOLEAN1 and BOOLEAN2 both are true",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			},
			{
				name: "BOOLEAN2",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/and.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			var boolean2 = state.inputs.item(1).getValue();
			state.outputs.item(0).setValue(boolean1 && boolean2);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.logic.or",
		description : "True if BOOLEAN1 or BOOLEAN2 or both of them are true",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			},
			{
				name: "BOOLEAN2",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/or.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			var boolean2 = state.inputs.item(1).getValue();
			state.outputs.item(0).setValue(boolean1 || boolean2);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.logic.xor",
		description : "True if exact one of the two inputs are true",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			},
			{
				name: "BOOLEAN2",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/xor.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			var boolean2 = state.inputs.item(1).getValue();
			state.outputs.item(0).setValue((boolean1&&!boolean2) || (boolean2&&!boolean1));
		}
	});
	
	cs.componentContainer.push({
		name : "cs.logic.not",
		description : "The opposit of BOOLEAN1",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/not.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			state.outputs.item(0).setValue(!boolean1);
		}
	});
	
	