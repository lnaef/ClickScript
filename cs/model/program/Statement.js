/**
 * @author elcc
 * 
 * CS.MODEL.PROGRAM.STATEMENT - This class represents a statement which is also a component but has additional
 * blocks
 */
	
	dojo.provide("cs.model.program.Statement");
	
	dojo.require("cs.model.program.Component");
	dojo.require("cs.util.Container");
	
 	dojo.declare("cs.model.program.Statement", cs.model.program.Component, {
		
		_blockContainer : null,
		_blockHeight : 0,
		_blockWidth : 0,
		
		constructor : function(a_metadata){
			this._blockContainer = new cs.util.Container();
			this.getMetaData().getBlocks().forEach(function(metaBlock){
				this.addBlock(new cs.model.program.Block(metaBlock,this));
			},this);
		},
		
		addBlock : function(a_block){
			this._blockContainer.add(a_block);
		},
		
		getBlock : function(nbr){
			return this._blockContainer.get(nbr);
		},
		
		hasBlock : function(a_block){
			return this._blockContainer.has(a_block);
		},
		
		getNbrOfBlock : function(){
			return this._blockContainer.size();
		},
		
		getBlocks : function(){
			return this._blockContainer;
		},
		
		forEachBlock : function(a_callback, /*optional*/ a_thisObject){
			this._blockContainer.forEach(a_callback, a_thisObject);
		},
		
		setDimProg : function(a_width, a_height){
			this._blockWidth = a_width;
			this._blockHeight = a_height;
		},
		
		serialize : function(){
			var blocks = "";
			
			this.getBlocks().forEach(function(item){
				blocks += item.serialize();
			});
			blocks = cs.global.serializer.serialize("blocks",null,blocks);
			
			// call serialize on superclass
			return this.constructor.superclass.serialize.call(this,blocks); 
			
		}
		
	});