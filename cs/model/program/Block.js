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
 * CS.MODEL.PROGRAM.BLOCK - This class represents a block e.g. of a statemnt. In a traditional
 * programming language we would compare this to brackets. In general such a block is bound to a
 * statement. All contained components will be registered in the block.
 * 
 * @todo: maybe it is enough to have addComponent and if it has blocks we add them to the 
 *        internal array _blockContainer. > rename moduleContainer to componentContainer and use
 *        addBlock only private
 */
	dojo.provide("cs.model.program.Block");
	dojo.require("cs.util._base");
	dojo.require("cs.util.Container");


	dojo.declare("cs.model.program.Block", null, {
		
		/**
		 * List of all contained modules
		 * @type : cs.util.Container
		 */
		_componentContainer : null,
		
		/**
		 * List of all contained blocks
		 * @type : cs.util.Container
		 */
		_blockContainer : null,
		
		/**
		 * The owner of this Block (a statement)
		 */
		_owner : null,
		
		_metadata : null,
		
		/**
		 * Dimension of the block
		 * {width, height}
		 */
		_dimension : null,
		
		/**
		 * uid of a block
		 * needed to reference contained blocks
		 */
		_uid : null,
		
		constructor : function(a_metaBlock, a_ownerStatement){
			
			// Set Uid
			this._uid = cs.global.serializer.getUid();
			
			this._metadata = a_metaBlock;
			this._owner = a_ownerStatement;
			
			this._componentContainer = new cs.util.Container();
			this._blockContainer = new cs.util.Container();	
			
			this.setDimension({width:cs.model.program.Block.dim.width , height:cs.model.program.Block.dim.height});
		},
		
		
		/**
		 * Adds a_component to the block and update its connection to its block
		 * @param {cs.model.program.Component} a_component
		 */
		addComponent : function(a_component){
			this._componentContainer.add(a_component);
			a_component.setParentBlock(this);

			if(a_component.isStatement()){
				a_component.forEachBlock(function(item){
					/* todo clean up after introducing container to statment*/
					this.addBlock(item);
				},this);		
			}
		},
		
		/**
		 * Adds a_block to this block
		 * @param {cs.model.program.Block} 
		 */
		addBlock : function(a_block){
			this._blockContainer.add(a_block);
		},
		
		/**
		 * Checks if block includes a_component on current level
		 * @todo: maybe we should check also the childes or implement a function for this purpose
		 * @param {cs.model.program.Component} a_component
		 */
		hasComponent : function(a_component){
			return this._componentContainer.has(a_component);
		},
		
		/**
		 * Cheks if block includes a_block on current level
		 * @param {cs.model.program.Block} a_block
		 */
		hasBlock: function(a_block){
			return this._blockContainer.has(a_block);
		},
		
		/**
		 * Removes a_component and all its blocks from this block
		 * @param {cs.model.program.Component} a_component
		 */
		removeComponent : function(a_component){
			if(this.hasComponent(a_component)){
				if (a_component.isStatement()) {
					// remove blocks from block container
					this._blockContainer.forEach(function(item){
						this.removeBlock(item);
					},this);
				}
				// remove component from component container
				this._componentContainer.remove(a_component);
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Destroys all contained components and its wires
		 */
		destroy : function(){
			
			// we have to copy list first, because destroy deletes components out of
			// the getCompoentContainer()
			var toDelete = new cs.util.Container();
			this.getComponentContainer().forEach(function(component){
				toDelete.add(component);
			});
			toDelete.forEach(function(component){
				component.destroy();
			});
			
			// TODO: proper cleanup
			// remove all components and blocks from this block
			this._componentContainer = new cs.util.Container();
			this._blockContainer = new cs.util.Container();
		},
		
		/**
		 * Removes a_block from this block
		 * @param {cs.model.program.block} a_block
		 */
		removeBlock : function(a_block){
			return this._blockContainer.remove(a_block);	
		},
		
		serialize : function(){
			/*
			 * Do not nested components at the moment
			 *//*var components = "";
			
			this.getComponentContainer().forEach(function(item){
				components += item.serialize();
			});*/
			return cs.global.serializer.serialize("block",{uid: this._uid, width:this.getDimension().width,height:this.getDimension().height}/*,components*/);
		},
		
		/**
		 * Getters
		 */
		getComponentContainer : function(){return this._componentContainer;},
		getBlocks : function(){return this._blockContainer;},
		getMetaData : function(){return this._metadata;},
		getOwner : function(){return this._owner;},
		getDimension : function(){return this._dimension;},
		getUid : function(){return this._uid;},
		
		/**
		 * Setters
		 */
		setDimension : function(a_dimension){this._dimension = a_dimension;}
	});
	

	cs.model.program.Block.dim ={
		width: 100,
		height: 100
	};