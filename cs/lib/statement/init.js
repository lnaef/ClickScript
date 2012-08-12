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
dojo.provide("cs.lib.statement.init");


	
	cs.componentContainer.push({
			name: "cs.statement.if",
			description: "If INPUT true it will execute the TRUE block, the FALSE block otherwise",
			inputs: [{
				name: "INPUT",
				type: "cs.type.Boolean"
			}],
			outputs: [],
			fields: [],
			image: "statement/if.png",
			blocks: [
			         {name: "TRUE"},
			         {name : "FALSE"}
			],
			exec : function(state){
				
				//dependent on the input of the Block, we execute Block one or two
				if(state.inputs.item(0).getValue()){
					
					// set FALSE-Block finished/completed
					state.blocks.item(1).forceFinished();
					
					
					// run TRUE-Block
					state.blocks.item(0).run();
				} else {
					state.blocks.item(0).forceFinished();
					state.blocks.item(1).run();
				}
			}//??? see controller for example of an exec
			//was wie: outputs.item(0).setExecValue(fields.item(0).getValue())
		});
	
	
	cs.componentContainer.push({
			name: "cs.statement.for-loop",
			description: "Loops N times",
			inputs: [{
				name: "N",
				type: "cs.type.Number"
			}],
			outputs: [{
						name: "i - current loop number",
						type: "cs.type.Number"
			}],
			fields: [],
			image: "statement/for-loop.png",
			blocks: [
				{name: "BODY"}
			],
			exec : function(state){
				var n = state.inputs.item(0).getValue();
				
				state.blocks.item(0).setOnFinish(
					function(state){
						this.currentN++;
						if(this.currentN <= state.inputs.item(0).getValue()){
							state.blocks.item(0).reset();
							state.outputs.item(0).setValue(this.currentN);
							state.blocks.item(0).run();
						} else {
							state.blocks.item(0).forceFinished();
						}		
					},
					this,
					state);
				
				// execute once
				this.currentN = 1;
				state.outputs.item(0).setValue(this.currentN);
				state.blocks.item(0).run();	
			}
		});
	
	cs.componentContainer.push({
		name: "cs.statement.for-each",
		description: "Loop through COLLECTION and output each time a ELEMENT",
		inputs: [{
			name: "COLLECTION",
			type: "Collection<cs.type.Number>"
		}],
		outputs: [{
			name: "ELEMENT",
			type: "cs.type.Number"
		}],
		fields: [],
		image: "statement/foreach.png",
		blocks: [
			{name: "BODY"}
		],
		exec : function(state){
			var collection = state.inputs.item(0).getValue();
			var size = collection.size();
			
			state.blocks.item(0).setOnFinish(
				function(state){
					this.currentN++;
					if(this.currentN < size){
						state.blocks.item(0).reset();
						state.outputs.item(0).setValue(collection.item(this.currentN));
						state.blocks.item(0).run();
					} else {
						state.blocks.item(0).forceFinished();
					}		
				},
				this,
				state);
			
			// execute once
			this.currentN = 0;
			if(size > 0){
				state.outputs.item(0).setValue(collection.item(this.currentN));
				state.blocks.item(0).run();	
			}
		}
	});
	
	cs.componentContainer.push({
		name: "cs.statement.util-button",
		description: "Loops till button pressed",
		inputs: [],
		outputs: [],
		fields: [],
		image: "statement/utilStop.png",
		blocks: [
			{name: "BODY"}
		],
		exec : function(state){
		
			this._stopped = false;
			dojo.connect(state.view.getNode(),"onclick",this,function(){this._stopped = true;});
			
			state.blocks.item(0).setOnFinish(
				function(state){
					if(!this._stopped){
						state.blocks.item(0).reset();
						state.blocks.item(0).run();
					} else {
						state.blocks.item(0).forceFinished();
					}		
				},
				this,
				state);
			
			// execute once
			state.blocks.item(0).run();	
		},
		view : {
			source : "<input type='button' value='stop' name='stop'/>"
			
		}
	});
	

	
	cs.componentContainer.push({
			name: "cs.statement.sequence",
			description: "Loops N times",
			inputs: [],
			outputs: [],
			fields: [],
			image: "statement/sequence.png",
			blocks: [
				{name: "FIRST"},
				{name: "SECOND"}
			],
			exec : function(state){
	
			
				state.blocks.item(0).setOnFinish(
					function(){
						state.blocks.item(0).forceFinished();
						state.blocks.item(1).run();
					},
					this);
				
				// execute once
				state.blocks.item(0).run();
				this.currentN =1;
	
			}
		});
	
	