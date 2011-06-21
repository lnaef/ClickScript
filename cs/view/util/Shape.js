/**
 * @author elcc
 */
/**
 * @author elcc
 */
	dojo.provide("cs.view.util.Shape");

	dojo.require("dojox.gfx.shape");
	dojo.require("cs.util._base");

	dojo.declare("cs.view.util.Shape", null, {
		
		_group : null,
		
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		bbox : null,
		bRect : null,
		
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
			this._group.matrix = dojox.gfx.matrix.identity;//{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0};
			this.bbox = {x:this.x, y:this.y, width: this.width, height: this.height};
			
			//todo: disconnect to avoid memory leaks
			this.getShape().connect("onclick",this,"onClick");
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
				dojo.connect(this,"onMoveStop",a_shape,"onMoveStop");
				
				
				//update the bounding Box of this shape
				this.updateBoundingBox();
			} else {
				throw Error("Shape has to be of type cs.view.util.Shape instead of '"+cs.util.getClassname(a_shape)+"' ");
			}
			
		},
		/**
		 * WARNING: DOUBLICATED FUNCTION: getBoundingBox
		 */		
		getBoundingBox : function(){
			return this.bbox;
		},
		
		updateBoundingBox : function(){
			if (this._group.children[0]) {
				var bb = this.getBoundingBox();
				this.bbox = bb;
				this.x = bb.x;
				this.y = bb.y;
				this.width = bb.width;
				this.height = bb.height;
			} 
		},
		
		remove : function(a_shape){
			return this._group.remove(a_shape);
		},
		
		createRect : function(a_shape){
			var shape = this._group.createRect(a_shape);
			this.updateBoundingBox();
			return shape;
		},
		
		createCircle : function(a_shape){
			var shape = this._group.createCircle(a_shape);
			this.updateBoundingBox();
			return shape;
		},
		
		createText : function(a_shape){
			var shape = this._group.createText(a_shape);
			this.updateBoundingBox();
			return shape;			
		},
		
		_isCsShape : function(a_shape){
			return cs.util.isTypeOf(a_shape, "cs.view.util.Shape");
		},
		
		getShape : function(){
			return this._group;
		}, 
		/**
		 * WARNING: DOUBLICATED FUNCTION: getBoundingBox
		 */
		getBoundingBox : function(){
			return this._group.getBoundingBox();
		},
		
		destroy : function(){
		  if(this._group){
			this._group.removeShape();  
		  }
		},
		
		getTransformedBoundingBox : function(){
			//var bb = this._group.getBoundingBox();
			//cs.test.playground.createRect({x:bb.x-3,y:bb.y-3,width:6,height:6}).setFill("#17f");
			//var r = this._group.parent._getRealMatrix();
			//if (this._group.children[0]) {
				
				//this._group._getRealMatrix()
/*

				var tb = this._group.getTransformedBoundingBox();
				var gg = this.getBoundingBox();
				var rm = this._group._getRealMatrix();
				console.log(tb,rm,gg);
				var r = {x:tb[0].x/rm.xx,y:tb[0].y/rm.yy,width:tb[2].x-tb[0].x,height:tb[2].y-tb[0].y};
				cs.test.playground.createRect(r).setStroke({stroke:"#345"});
				
				
				return this._group.children[0].getTransformedBoundingBox();
*/
				
			//}
			//return this._group.getTransformedBoundingBox();
			return this._group.getTransformedBoundingBox();
		},
		
		/**
		 * If there is a move on an Container, this gets executed
		 */
		onMove : function(){
			// to be overwritten by sublcasses
		},
		
		onMoveStop : function(){
			// to be overwritten by subclasses
		},
		
		/**
		 * If there is a move on an Container, this gets executed
		 */
		onClick : function(){
			// to be overwritten by sublcasses
		}

		
	});
dojo.extend(dojox.gfx.Group,{
		getBoundingBox : function(){
			if (this.children[0]) {
				var bb = dojo.clone(this.children[0].getBoundingBox());
				
				dojo.forEach(this.children, function(item){
					var childBB = item.getBoundingBox();
					if(!bb){
						bb = dojo.clone(item.getBoundingBox());
					}
					
					//cs.test.drawRect(bb.x,bb.y,bb.width,bb.height);
					
					if (childBB) {
						var result = dojo.clone(bb);
						result.x = (childBB.x < bb.x) ? childBB.x : bb.x;
						result.y = (childBB.y < bb.y) ? childBB.y : bb.y;
						result.width = (bb.x + bb.width < childBB.x + childBB.width) ? childBB.x + childBB.width - result.x : bb.x + bb.width - result.x;
						result.height = (bb.y + bb.height < childBB.y + childBB.height) ? childBB.y + childBB.height - result.y : bb.y + bb.height - result.y;
						result.r = 0;
						bb = result;
					}
				});
				// Test Bounding box, show border
				return bb;
			} else {
				return null;
			}

	}
			
		
		
		});


