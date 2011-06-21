/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Block");
	
	dojo.declare("cs.view.program.Block", cs.view.util.Shape, {

		/**
		 * {{x,y}} Effective Coords of the block
		 * 
		 */
		_position : null,
		
		/**
		 * {cs.model.program.block} the model of this block
		 */
		_blockModel : null,
		
		/* shape of the rect */
		_blockShape : null,
		
		/* shape of the right bottom corner to resize the block */
		_resizeShape : null,
		
		/* mover of the right bottom corner to resize the block */
		_resizeMoveable : null,
		
		/**
		 * @param {???} a_csViewGroup : used for constructor 
		 * @param {???} a_position    : position of this block
		 * @param {???} a_blockModel  : model of the current block
		 */
		constructor : function(a_csViewGroup,a_position, a_blockModel){
			
			/**
			 * Init Object
			 */
			this._position = a_position;
			this._blockModel = a_blockModel;
			
			/**
			 * Draw Block
			 */
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
			var ownerComponent = this._blockModel.getOwner();
			
			// block rect
			this._blockShape = this.getShape().createRect({
				x      : this._position.x ,
				y      : this._position.y,
				width  : this.getModel().getDimension().width,
				height : this.getModel().getDimension().height,
				r      : dim.roundCorner
			}).setFill(dim.fill).setStroke(dim.stroke);
			
			// block name
			this.getShape().createText({					
					x: this._position.x + 12, 
					y: this._position.y + 17,
					text : this.getModel().getMetaData().getName(),
					align: "left"}).setFont(dim.font.style).setFill(dim.font.fill);
			
			
			// block resize
			this._resizeShape = this.getShape().createImage({
				src   : dim.resize.path,
				width : dim.resize.width,
				height: dim.resize.height,
				x: this._position.x + this.getModel().getDimension().width  - dim.resize.width,// + correctX,
				y: this._position.y + this.getModel().getDimension().height - dim.resize.height
			});	
			

			/**
			 * Initialize resisizer on the bottom right corner of the Block
			 */
			/**
			 * TODO: Mover restrict to certain area
			 */
			this._resizeMoveable = new dojox.gfx.Moveable(this._resizeShape);
			dojo.connect(this._resizeMoveable,"onMove",this,"onResize");		//TODO: this._moveableEvents.push(dojo.connect(moveable,"onMoveStop",this,function(mover){ to destroy?!?!
			
			dojo.connect(this._resizeMoveable,"onMoveStop",this,function(mover){
				var dimension = this.onResize(this._resizeMoveable);
				// TODO: Do call by event!
		        cs.modelController.updateBlockDimension(this.getModel(),{width:dimension.width, height:dimension.height});
			});

		},
		

		
		onResize : function(mover){
					
			/**
			 * Bounding box of the mover icon
			 */
			var moverTbb = mover.shape.getTransformedBoundingBox();
			
			/**
			 * Reset the bounding Box
			 */
			var blockShape    = this.getBlockShape();
	        var blockShapeTbb = blockShape.getTransformedBoundingBox();
	        blockShape.width  = moverTbb[2].x - blockShapeTbb[0].x; // just add 1 to see it move
	        blockShape.height = moverTbb[2].y - blockShapeTbb[0].y;
	        this.getBlockShape().setShape(blockShape);	
	        return {width: blockShape.width, height: blockShape.height};		
		},
		
		/**
		 * Add component to this block???
		 * @param {???} a_component: Component which to be added to the block
		 */
		addComponent : function(a_component){
			a_component.setParentBlock(this);
		},
		
		
		
		/**
		 * Resize the block-shape (also used in statement shape)
		 */
		updateView : function(a_x, a_y, a_width, a_height){
			
			// Position in the model
			this._position.x = a_x;
			this._position.y = a_y;
			
			// get component
			var statement = this._blockModel.getOwner();

			/**
			 * Move the whole Block (incl. Text and pictures) to the new position (a_x, a_y)
			 * The distance to move is the new position - the old position
			 * The old position we get with the transformed boundry box
			 */			
			var tbb = this.getShape().getTransformedBoundingBox();
			var deltaX = a_x - tbb[0].x;
			var deltaY = a_y - tbb[0].y;
			this.getShape().applyTransform({dx: deltaX, dy: deltaY});

			/**
			 * Because of changing the size directly on modelController level we also 
			 * have to change the position of the resize-Icon on the bottom right corner.
			 */
			var tbbResizeShape = this._resizeShape.getTransformedBoundingBox();
			var deltaXResizeShape = a_x + a_width  - cs.view.program.Block.dim.resize.width - tbbResizeShape[0].x;
			var deltaYResizeShape = a_y + a_height - cs.view.program.Block.dim.resize.height - tbbResizeShape[0].y;
			this._resizeShape.applyTransform({dx: deltaXResizeShape, dy: deltaYResizeShape});			
			
			
			/**
			 * We have to move each component. Inside the block
			 */
			// TODO: we have to update each component in this block.
			this.getModel().getComponentContainer().forEach(function(componentModel){
				
				// TODO: also update wires
				// TODO: by Event
				// TODO: use move function on component to update component position ?! (Through event)
				var x = componentModel.getPositionProg().x + deltaX;
				var y = componentModel.getPositionProg().y + deltaY;
				cs.modelController.updatePositionProg(componentModel,x,y);
				//cs.viewController._getComponentShape(componentModel).getShape().applyTransform({dx: deltaX, dy: deltaY});
		
			},this);
			
			
			/**
			 * Resize only the Block element
			 */
			var blockShape = this.getBlockShape();
	        blockShape.width = a_width; // just add 1 to see it move
	        blockShape.height =a_height;
	        this._blockShape.setShape(blockShape);
	        
			/** 
			 * SCALE would be possible but also stroke is scaled
			 *//*
	        var blockShapeTbb = this.getBlockShape().getTransformedBoundingBox();
	        var scaleX = a_width / (blockShapeTbb[1].x-blockShapeTbb[0].x);          
	        var scaleY = a_height / (blockShapeTbb[2].y-blockShapeTbb[0].y); 
	        this.getBlockShape().applyTransform({xx:scaleX, yy:scaleY, dx: -(scaleX-1)*blockShapeTbb[0].x, dy: -(scaleY-1)*blockShapeTbb[0].y});
	        */
		},
		
		
		/**
		 * Todo: Needed, could be moved to Shape.js
		 */
		moveToFront : function(){},
		
		/**
		 * getter
		 */
		getBlockShape : function(){ return this._blockShape; },
		getModel      : function(){ return this._blockModel; },		
		_getDim       : function(){ return cs.view.program.Block.dim; }
		
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
					},
					resize: { // icon
						path : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ) + "util/images/resize.png",
						width: 16,
						height: 16
					},
					getCorrectX : function(a_componentModel){
						
						// correctX of a Component (cause of the input-sockets)
						var correctX =  cs.view.program.Component.dim.getCorrectX(a_componentModel);
						
						// correctX because of the body of the component
						    correctX += a_componentModel.isPrimitive() ? 13+cs.view.program.Field.dim.width  : cs.view.program.Component.dim.width-2*cs.view.program.Component.dim.paddingLeftRight;
						return correctX; 
					}
				};