/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Wire");
	
	dojo.require("cs.view.util.Shape");
	
	dojo.declare("cs.view.program.Wire", cs.view.util.Shape, {

		
		/**
		 * Model of this View
		 */
		_wireModel : null,
		
		_fromSocket : null,
		_toSocket : null,
		
		// shape for the wire
		_wireShape : null,
		
		_surface : null,
		
		/*
		 * all connection handlers
		 */
		_conns : null,
		_wireConn : null,
		/**
		 * Creates new shape
		 * @param {dojox.gfx.Shape|cs.view.utilGroup} a_rawNode
		 * @param {{x,y}} a_centerPos
		 * @param {cs.model.program.Component} moduleModel
		 */
		constructor : function(a_surface,a_fromSocket,a_toSocket,a_wireModel){
			var dim = this._getDim();
			
			this._fromSocket = a_fromSocket;
			this._toSocket = a_toSocket;
			this._wireModel = a_wireModel;
			this._surface = a_surface;
			
			//draw the wire
			this.updateView();

			//todo : disconnect to avoid memory leaks
			this._conns = new cs.util.Container();
			this._conns.add(dojo.connect(this._fromSocket,"onMove",this,"updateView"));
			this._conns.add(dojo.connect(this._toSocket,"onMove",this,"updateView"));
			this._conns.add(dojo.connect(this._toSocket,"onMoveToFront",this.getShape(),"moveToFront"));
			this._conns.add(dojo.connect(this._fromSocket,"onMoveToFront",this.getShape(),"moveToFront"));
		},
		
		updateView: function(){
			
			var dim = this._getDim();
			
			
            //var from = this._getConnectingPoint(this._fromSocket);
			//var to   = this._getConnectingPoint(this._toSocket);			
			
			var from = {};
			var to = {};
			
			// The transformmatrix of the surface we place the wires
			var real = this._surface._getRealMatrix();
			
			// if there is no transformmatrix on the surface, take the neutral matrix
			if (!real){
				real =  {xx:1,xy:0,yx:0,yy:1,dx:0,dy:0};
			}
			
			// calculate an invertion matrix 
			var invert = {
				dx : -real.dx,
				dy : -real.dy,
				xx : 1/real.xx,
				yy : 1/real.yy
			};
			
			// get the connecting points of the sockets
			var tf = this._getConnectingPoint(this._fromSocket);
			var tt = this._getConnectingPoint(this._toSocket);
			
			
			
			// transform the points by the invertion matrix of the parent surface 
			from.x = invert.xx * (tf.x + invert.dx);
			from.y = invert.yy * (tf.y + invert.dy);
			to.x = invert.xx * (tt.x + invert.dx);
			to.y = invert.yy * (tt.y + invert.dy);			
			
			//console.log(real,invert,"points: ",tf,"all",from);
			
			//remove shape if available
			if(this._wireShape){
				this._wireShape.removeShape();
				//disabled
				//dojo.disconnect(this._wireConn);
			}			
			
			// draw line
			var stroke = null;
			if (this.isValidConnection()){
				var isCollection = this._fromSocket.getModel().getMetaData().getType().isCollection() || this._toSocket.getModel().getMetaData().getType().isCollection();
				stroke = dojo.clone(isCollection ? dim.strokeCollection : dim.strokeDefault);
				stroke.color = this._fromSocket.getModel().getType().getColor();

			} else {
				stroke = dim.strokeBroken;
			}

			// factor for tangential points for the bezzier curve
			var factor = 30;
			
			// calculate first tangential point
			cx1 = (!this._fromSocket.getModel().isInput()) ?  from.x+factor : from.x-factor;
			cy1 = from.y;				
			
			// calculate second tangetial point
			cx2 = (!this._toSocket.getModel().isInput()) ?  to.x+factor : to.x-factor;
			cy2 = to.y;			
			// draw the bezzier curve 
			this._wireShape = this._surface.createPath();
			this._wireShape.moveTo(from.x,from.y);
			this._wireShape.curveTo(cx1,cy1,cx2,cy2,to.x,to.y);
			//this._wireShape.lineTo(to.x,to.y);
			this._wireShape.setStroke(stroke);
			
			//needed?!
			//this._wireConn = this._wireShape.connect("onclick",this,"onClick");
			
			
			this._group.add(this._wireShape);
			//console.log("drawed line",from,to);
		},
		
		onClick : function(){
			console.log("clicked on wire");
			dojo.publish("view/program/Wire/Clicked", [this]);
		},
		
		isValidConnection : function(){
			return this._wireModel.isValidConnection();
		},
		
		_getConnectingPoint : function(socket){
			var sockettb = socket.getTransformedBoundingBox();
			//console.log(socket.getShape()._getRealMatrix());
			//console.log(socket.getShape().getTransform());
			return {
			  x : (socket.getModel().isInput()) ? sockettb[0].x : sockettb[1].x,
			  y : sockettb[0].y + Math.round((sockettb[2].y - sockettb[0].y)/2)
			};
		},
		
		_getDim : function(){
			return cs.view.program.Wire.dim;
		},
		
		getModel : function(){
			return this._wireModel;
		},
		
		destroy : function(){
			this._conns.forEach(dojo.disconnect);
			//disabled
			//dojo.disconnect(this._wireConn);
		}
		
	});
	
	cs.view.program.Wire.dim ={ 
				strokeBroken : {
					width : 3,
					color : "#000",
					style : "ShortDash"	
				},
				strokeCollection : {
					width : 6,
					color : "#000",
					style : "Solid",
					cap: "round"
				},
				strokeDefault : {
					width : 3,
					color : "#000"
				}
			};
				