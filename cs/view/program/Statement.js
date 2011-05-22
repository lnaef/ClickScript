/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Statement");

	dojo.require("cs.view.program.Component");
	dojo.require("cs.view.program.Block");
	dojo.require("cs.util.Container");
	
	dojo.declare("cs.view.program.Statement", cs.view.program.Component, {

		_blocks : null,

		constructor : function(a_csViewGroup,a_centerPos,moduleModel){
			this._blocks = new cs.util.Container();
			
			this.drawBlocks();
			this.moveToFront();
		},
		
		/**
		 * @todo make this function multi-usable problem that every time new sockets get generated
		 */
		drawBlocks : function(){
			var dim = this._getDim();
			
			

			this.getModel().getBlocks().forEach(function(blockModel,index){
				//@todo something not proper with x
				//var block = new cs.view.program.Block(this, {x:this._position.x + Math.round(dim.width/2) - 3*dim.paddingLeftRight, y: this._position.y -Math.round(dim.height/2) + index * cs.view.program.Block.dim.defaultHeight},blockModel);
				var block = new cs.view.program.Block(this, {x:this._position.x, y: this._position.y + index * cs.view.program.Block.dim.defaultHeight},blockModel);
				
				// add shape
				this.add(block);
				
				// propagate onMoveToFront event
				dojo.connect(this,"moveToFront",block,"moveToFront");
				
				// add socket to input container		
				this._blocks.add(block);
			},this);
		},
		
		getBlocks : function(){
			return this._blocks;
		}
		
	});
	