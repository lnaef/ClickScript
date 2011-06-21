/**
 * @author elcc
 */










	dojo.provide("cs.view.util.Shape");

	dojo.require("dojox.gfx.shape");

	dojo.declare("cs.view.util.Shape", null, {
		
		_group : null,
		
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		bbox : null,
		
		/**
		 * 
		 * @param {Object} a_shape
		 */
		constructor : function(a_shape){
			// Default shape setup
			if (this._isCsShape(a_shape)) {
				this._group = a_shape.getShape().createGroup();
			} else {
				this._group = a_shape.createGroup();
			}
			this.bbox = {x:this.x, y:this.y, width: this.width, height: this.height};
		},
		

		/**
		 * Add a cs.view.util.Shape to this shape
		 * @param {cs.view.util.Shape} a_shape
		 */
		add : function(a_shape){
			if(this._isCsShape(a_shape)){
				
				//add the shape to this group
				this._group.add(a_shape.getShape());
				
				//todo : disconnect - ie memory leaks
				dojo.connect(this,"onMove",a_shape,"onMove");
				
				//update the bounding Box of this shape
				this.updateBoundingBox();
			} else {
				throw Error("Shape has to be of type cs.view.util.Shape instead of '"+cs.util.getClassname(a_shape)+"' ");
			}
			
		},
		
		getBoundingBox : function(){
			return this.bbox;
		},
		
		updateBoundingBox : function(){
			if (this._group.children[0]) {
				var bb = dojo.clone(this._group.children[0].getBoundingBox());
				
				dojo.forEach(this.children, function(item){
					var childBB = item.getBoundingBox();
					var result = dojo.clone(bb);
					result.x = (childBB.x < bb.x) ? childBB.x : bb.x;
					result.y = (childBB.y < bb.y) ? childBB.y : bb.y;
					result.width = (bb.x + bb.width < childBB.x + childBB.width) ? childBB.x + childBB.width - result.x : bb.x + bb.width - result.x;
					result.height = (bb.y + bb.height < childBB.y + childBB.height) ? childBB.y + childBB.height - result.y : bb.y + bb.height - result.y;
					
					bb = result;
				});
				/* Test Bounding box, show border*/
				this.bbox = bb;
				this.x = bb.x;
				this.y = bb.y;
				this.width = bb.width;
				this.height = bb.height;
			} 
		},
		
		createRect : function(a_shape){
			var shape = this._group.createRect(a_shape);
			this.updateBoundingBox();
			return shape;
		},
		
		_isCsShape : function(a_shape){
			return cs.util.isTypeOf(a_shape, "cs.view.util.Shape");
		},
		
		getShape : function(){
			return this._group;
		}, 
		
		getTransformedBoundingBox : function(){
			return this._group.getTransformedBoundingBox;
		},
		
		/**
		 * If there is a move on an Container, this gets executed
		 */
		onMove : function(){
			// to be overwritten by sublcasses
		}

		
	});
