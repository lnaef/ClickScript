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

dojo.provide("cs.lib.math.init");


	cs.componentContainer.push({
		name : "cs.math.add",
		description : "This module adds the two two numbers NUMBER1 and NUMBER2",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Number"
			}],
		image: "math/add.png",
		exec : function(state){
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue(number1 + number2);
		}
	});
	
	
	cs.componentContainer.push({
		name : "cs.math.subtract",
		description : "This module subtracts NUMBER2 from NUMBER1",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Number"
			}],
		image: "math/subtract.png",
		exec : function(state){
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue(number1 - number2);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.math.multiply",
		description : "This module multiplies NUMBER1 with NUMBER2",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Number"
			}],
		image: "math/multiply.png",
		exec : function(state){
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue(number1 * number2);
		}
	});

	cs.componentContainer.push({
		name : "cs.math.divide",
		description : "This module divides NUMBER1 by NUMBER2",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Number"
			}],
		image: "math/divide.png",
		exec : function(state){
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue(number1 / number2);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.math.random",
		description : "This module generates a random number between LOWEST and HIGHEST ",
		inputs : 
			[],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Number"
			}],
		fields:[{
				name: "LOWEST",
				type: "cs.type.Number"
			},
			{
				name: "HIGHEST",
				type: "cs.type.Number"
			}],
		image: "math/random.png",
		exec : function(state){
			var lowest = parseFloat(state.fields.item(1).getValue());
			var highest = parseFloat(state.fields.item(0).getValue());
			lowest = lowest ? lowest : 0;
			highest = highest ? highest : 100;
			
			var rand = (lowest <= highest) ? Math.round(lowest + (highest-lowest) * Math.random()) : 0;
			state.outputs.item(0).setValue(rand);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.math.diagram",
		description : "This module plots incoming VALUEs, MAXROW is a optional field to set the maximum of rows shown",
		inputs : 
			[
				{
					name: "VALUE",
					type: "cs.type.Number"
				}
			],
		outputs:  
			[],
		fields:
			[{				
				name: "MAXROWS",
				type: "cs.type.Number"
			}],
		image: "math/plot.png",
		exec : function(state){
			
			// prepare container if not already exist
			if(!this._container){
				this._container = new cs.util.Container();
			}
			
			// input value
			var newValue = state.inputs.item(0).getValue() ? parseFloat(state.inputs.item(0).getValue()) : 0;
			var maxRow = state.fields.item(0).getValue() ? parseFloat(state.fields.item(0).getValue()) : 0;
			
			// add new value to container
			this._container.add(newValue);
			
			// remove rows if there are more then maxRows
			if(maxRow > 0 && this._container.size() > maxRow){
				var newContainer = new cs.util.Container();
				this._container.forEach(function(value,i){
					if(i >= this._container.size()-maxRow){
						newContainer.add(value);
					}
				},this);
				this._container = newContainer;
			}
			
			// draw
			state.view.draw(this._container);


		},			
		view : {
			// how to prevent changing style on each lamp?
			source : "<div style='width:200px;height:100px;border:1px solid black;'></div>",
			
			draw : function(a_container){
			    // it is not possible to acces cs.config.rootPath in source attribute
				$(this.getNode()).css("backgroundImage","url('"+cs.config.rootPath+"lib/math/barback.png')");
			    var width = 200;
			    var height = 100;
			    var out = "";
			    var max = 0;
			    a_container.forEach(function(value){
					if(max < value){
						max = value;
					}
			    });
				a_container.forEach(function(value){
					out += "<div style='width:"+Math.floor(width/a_container.size())+"px;height:"+height+"px;float:left;background-image:url(\""+cs.config.rootPath+"lib/math/bar.png\");background-repeat:no-repeat;background-position: 0px "+Math.floor((height-(height/max)*value))+"px'></div>";
			    });
			    out += "<div style='font-size:7pt;color:black'>100% : "+max+"</div>"; 
			    
				this.getNode().innerHTML = out;
			}
		}, reset : function(state){
			this._container = null;
		}
	});
	
	
	cs.componentContainer.push({
		name : "cs.math.is_smaller",
		description : "RESULT is True if NUMBER1 is smaller than NUMBER2",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "math/smaller.png",
		exec : function(state){			
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue((number1<number2));
		}
	});

	cs.componentContainer.push({
		name : "cs.math.is_greater",
		description : "RESULT is True if NUMBER1 is greater than NUMBER2",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "math/bigger.png",
		exec : function(state){			
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue((number1>number2));
		}
	});
	
	
	cs.componentContainer.push({
		name : "cs.math.is_equal",
		description : "RESULT is True if NUMBER1 and NUMBER2 are the same",
		inputs : 
			[{
				name: "NUMBER1",
				type: "cs.type.Number"
			},
			{
				name: "NUMBER2",
				type: "cs.type.Number"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "math/equal.png",
		exec : function(state){			
			var number1 = parseFloat(state.inputs.item(0).getValue());
			var number2 = parseFloat(state.inputs.item(1).getValue());
			state.outputs.item(0).setValue((number1 == number2));
		}
	});