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
			var currentY = 0;
			

			this.getModel().getBlocks().forEach(function(blockModel,index){
				
				var block = new cs.view.program.Block(this, {x:this._position.x+cs.view.program.Block.dim.getCorrectX(blockModel.getOwner()), y: this._position.y + currentY},blockModel);
				
				// Y of the next Block has to be placed one Block down
				currentY += blockModel.getDimension().height;
				
				// add shape
				this.add(block);
				
				// propagate onMoveToFront event
				dojo.connect(this,"moveToFront",block,"moveToFront");
				
				// add socket to input container		
				this._blocks.add(block);
			},this);
		},
		
		resizeBlocks : function(){
			
			/** 
			 * Each Blocks Y-Coordinate has to be changed according to the blocks before (adding the block heihgts)
			 */
			var currentY = 0;
			
			/**
			 * Correction to the right because of the Component body (grey block and input sockets)
			 */
			var correctX = cs.view.program.Block.dim.getCorrectX(this.getModel());
			
			var posX = 0;
			var posY = 0;
			this._blocks.forEach(function(blockView,index){
				var dimension = blockView.getModel().getDimension();
				posX = blockView.getModel().getOwner().getPositionProg().x + correctX;
				posY = blockView.getModel().getOwner().getPositionProg().y + currentY;    
				console.log("resizeBlocks x,y "+posX+":"+posY);
				blockView.updateView(posX, posY , dimension.width, dimension.height);
				currentY += dimension.height;
			},this);
		},
		/**
		updatePosition : function(a_x,a_y){
			
			 * Call method in superclass (cs.view.Component)
			
			this.getBlocks().forEach(function(blockShape,index){
				blockShape.getComponentContainer().forEach(function(componentShape,index){
					console.log('now');
				});
			});
		}, */
		
		getBlocks : function(){
			return this._blocks;
		}
		
	});
	