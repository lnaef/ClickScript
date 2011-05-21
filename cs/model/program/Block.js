/**
 * @author elcc
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
		
		constructor : function(a_metaBlock, a_ownerStatement){
			this._metadata = a_metaBlock;
			this._owner = a_ownerStatement;
			
			this._componentContainer = new cs.util.Container();
			this._blockContainer = new cs.util.Container();	
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
			var output = "";
			this.getComponentContainer().forEach(function(item){
				output = output + item.serialize();
			});
			return cs.serializer.createElement("<block>",output,"</block>");
		},
		
		/**
		 * Getters
		 */
		getComponentContainer : function(){return this._componentContainer;},
		getBlocks : function(){return this._blockContainer;},
		getMetaData : function(){return this._metadata;},
		getOwner : function(){return this._owner;}
	});