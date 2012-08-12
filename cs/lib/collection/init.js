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
dojo.provide("cs.lib.collection.init");
	
	
	
	cs.componentContainer.push({
		name: "cs.collection.pipe",
		description: "RESULT is collection of all incomming ELEMENTSs (at the moment only type numbers)",
		inputs: [{
			name: "VALUE",
			type: "cs.type.Number"
		}],
		outputs: [{
			name: "RESULT",
			type: "Collection<cs.type.Number>"
		}],
		fields: [],
		image: "collection/pipe.png",
		exec : function(state){
			var value = state.inputs.item(0).getValue();
			
			if(!this._collection){
				this._collection = new cs.util.Container();
			}
			this._collection.add(value);
			state.outputs.item(0).setValue(this._collection.copy());
		},
		reset : function(){
			this._collection = new cs.util.Container();
		}		
	});
	
	cs.componentContainer.push({
		name: "cs.collection.add",
		description: "Adds ELEMENT to the COLLECTION",
		inputs: [{
			name: "COLLECTION",
			type: "Collection<cs.type.Number>"
		},
		{
			name: "ELEMENT",
			type: "cs.type.Number"
		}],
		outputs: [{
			name: "RESULT",
			type: "Collection<cs.type.Number>"
		}],
		fields: [],
		image: "collection/addElement.png",
		exec : function(state){
			var collection = state.inputs.item(0).getValue();	
			var element = state.inputs.item(1).getValue();
			
			// decoppeling
			collection = collection.copy();
			
			
			collection.add(element);
			
			state.outputs.item(0).setValue(collection);
		}		
	});
	
	
	cs.componentContainer.push({
		name: "cs.collection.has",
		description: "True if COLLECTION has ELEMENT",
		inputs: [{
			name: "COLLECTION",
			type: "Collection<cs.type.Number>"
		},
		{
			name: "ELEMENT",
			type: "cs.type.Number"
		}],
		outputs: [{
			name: "RESULT",
			type: "cs.type.Boolean"
		}],
		fields: [],
		image: "collection/hasElement.png",
		exec : function(state){
			var collection = state.inputs.item(0).getValue();
			var element = state.inputs.item(1).getValue();

			state.outputs.item(0).setValue(collection.has(element));
		}		
	});
	
	
	cs.componentContainer.push({
		name: "cs.collection.remove",
		description: "Remove ELEMENT from COLLECTION",
		inputs: [{
			name: "COLLECTION",
			type: "Collection<cs.type.Number>"
		},
		{
			name: "ELEMENT",
			type: "cs.type.Number"
		}],
		outputs: [{
			name: "RESULT",
			type: "Collection<cs.type.Number>"
		}],
		fields: [],
		image: "collection/removeElement.png",
		exec : function(state){
			var collection = state.inputs.item(0).getValue();
			var element = state.inputs.item(1).getValue();
			collection = collection.copy();
			collection.remove(element);
			
			state.outputs.item(0).setValue(collection);
		}		
	});