/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Block");
	
	dojo.declare("cs.view.program.Block", cs.view.util.Shape, {

		_position : null,
		
		_blockModel : null,
		
		_containedComponents : null,
		
		/* scale block with */
		_scale : 1,
		
		/* shape of the rect */
		blockShape : null,
		
		constructor : function(a_csViewGroup,a_position, a_blockModel){
			this._position = a_position;
			this._blockModel = a_blockModel;
			this._containedComponents = new cs.util.Container();
			this.draw();
			
			/*
			 * onmouseup is not possible because there is no event-bubbling on svg-shapes
			 * so if we move a component, then block does not get activated
			 * 
			 * still problem if some blocks overlapp > move to controller
			 */
			//dojo.subscribe("/cs/dnd/ondrop",this,"onCsDndDrop")
		},
		
		/**
		 * Gets called if a move of a component stops
		 * @param {cs.view.program.Component} a_component Component which was moved
		 * @param {Object} a_mover     Moverevent
		 */
		/*
		  
		 onCsDndDrop : function(a_component, a_mover){
			
			var componentBB = a_component.getShape().getTransformedBoundingBox();
			
			// only if hole component covers the shape
			if (this.isBoundingBoxInside(componentBB)){
				
				console.log("Let's move a module to an other block",this);
					dojo.publish("view/program/Block/ComponentSwitchBlock",[a_component,this]);
			}
		},*/
		
		/**
		 * True if a bb (Transformed Boundingbox) is inside the block
		 * @param {Transformed Boundingbox} a_bb
		 */
		/*
		isBoundingBoxInside : function(a_bb){
			var thisBB = this.getShape().getTransformedBoundingBox();
			return a_bb[0].x > thisBB[0].x && a_bb[1].x < thisBB[1].x && a_bb[0].y > thisBB[0].y && a_bb[2].y < thisBB[2].y;
		},
		*/
		
		
		/**
		 * @todo make this function multi-usable problem that every time new sockets get generated
		 */
		draw: function(){
			var dim = this._getDim();
			
			// block rect
			this.blockShape = this.createRect({
				x : this._position.x,
				y : this._position.y,
				width : dim.defaultWidth,
				height : dim.defaultHeight,
				r : dim.roundCorner
			}).setFill(dim.fill).setStroke(dim.stroke);
			
			// block name
			this.createText({					
					x: this._position.x + dim.plus.width + dim.minus.width + 12,
					y: this._position.y + 17,
					text: this.getModel().getMetaData().getName(),
					align: "left"}).setFont(dim.font.style).setFill(dim.font.fill);
			
			// scale up and down

			var scaleUp = this.getShape().createImage({
				src:  dim.plus.path,
				width: dim.plus.width,
				height: dim.plus.height,
				x : this._position.x + dim.scale.x,
				y : this._position.y + dim.scale.y
			});
			var scaleDown = this.getShape().createImage({
				src:  dim.minus.path,
				width: dim.minus.width,
				height: dim.minus.height,
				x: this._position.x + dim.scale.x + dim.plus.width + 2,
				y: this._position.y + dim.scale.y
			});
				
				// hotfix : in svg (ff3.5) image is not displayed if attribute fill="none" in svg:image
				// dojo in setRawNode sets it per default.
				if (dojox.gfx.renderer == "svg") {
					scaleUp.rawNode.removeAttribute("fill");
					scaleDown.rawNode.removeAttribute("fill");
				}
			

			scaleUp.connect("onclick",this,"scaleUp");
			scaleDown.connect("onclick",this,"scaleDown");
		},
		
		getModel : function(){
			return this._blockModel;
		},
		
		_getDim : function(){
			return cs.view.program.Block.dim;
		},
		
		addComponent : function(a_component){
		
			a_component.setParentBlock(this);
			
		},
		
		scaleUp : function(){
			console.log("scale up");
			/*
			this._scale += 0.3;	
			this.blockShape.setTransform([dojox.gfx.matrix.scaleAt(this._scale,this.blockShape.shape.x,this.blockShape.shape.y)]);
			this.blockShape.setStroke(cs.view.program.Block.dim.stroke);
			*/
			
			// �bernehmen f�r scale down!
			this._scale += 0.3;	
	        var shape = this.blockShape.getShape(); // get the shape
	        shape.width = Math.round(this._getDim().defaultWidth*this._scale); // just add 1 to see it move
	        shape.height =Math.round(this._getDim().defaultHeight*this._scale);
	        this.blockShape.setShape(shape); 
		},
		
		scaleDown : function(){
			console.log("scale down" + this._scale);
			if(this._scale > 0.4){
				this._scale -= 0.3;}
	        var shape = this.blockShape.getShape(); // get the shape
	        shape.width = Math.round(this._getDim().defaultWidth*this._scale); // just add 1 to see it move
	        shape.height =Math.round(this._getDim().defaultHeight*this._scale);
	        this.blockShape.setShape(shape);			
			//this.blockShape.setTransform([dojox.gfx.matrix.scaleAt(this._scale,this.blockShape.shape.x,this.blockShape.shape.y)]);
			//this.blockShape.setStroke(cs.view.program.Block.dim.stroke);
		},
		
		/**
		 * Todo: Needed, could be moved to Shape.js
		 */
		moveToFront : function(){
			
		}

	});
	
	cs.view.program.Block.dim ={ 
					defaultWidth : 200,
					defaultHeight : 150,
					roundCorner: 5,
					fill : "#fff",
					stroke : {
						color : "#666",
						width : 2,
						style : "shortdash"
					},
					font: {
						style: {
							family: "monospace",
							size: "12px",
							weight: "normal"
						},
						fill : "#555" 
					},
					scale: {
						x : 4,
						y : 4				
					},
					plus : { // icon
						path : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ) + "util/images/plus.png",
						width: 16,
						height: 16
					},
					minus: { // icon
						path : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ) + "util/images/minus.png",
						width: 16,
						height: 16
					}
				};