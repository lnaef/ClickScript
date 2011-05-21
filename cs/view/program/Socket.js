/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Socket");
	
	dojo.require("dojox.gfx.move");
	dojo.require("cs.view.util.Shape");
	
	dojo.declare("cs.view.program.Socket", cs.view.util.Shape, {
		
		
		/**
		 * Model of this View
		 */
		_socketModel : null,
		
		/**
		 * Shape of rect for socket
		 */
		_socketShape : null,
		
		
		_stroke : null,
		_fill: null,
		
		_position : null,
		/**
		 * Creates new shape
		 * @param {dojox.gfx.Shape} a_rawNode
		 * @param {{x,y}} a_centerPos
		 * @param {cs.model.program.Socket} socketModel
		 */
		constructor : function(a_csViewGroup,a_position,a_socketModel){
			
			this._socketModel = a_socketModel;
			this._position = a_position;
			
			var dim = this._getDim();
			var facStroke    = (this.getModel().getMetaData().getType().isCollection()) ? 0.5 : 0.7;
			var facFill      = 1; // set in type depending on collectio nor not!
			var defaultColor = this._socketModel.getType().getColor();
			
			this._stroke = dojo.clone(this.getModel().getMetaData().getType().isCollection() ? dim.collectionStroke : dim.stroke);
			this._stroke.color = this.darken(defaultColor,facStroke);
			this._fill = this.darken(defaultColor, facFill);
			//this.draw();
		},
		
		postscript : function(){
			this.draw();
		},
		
		darken: function(a_color, a_factor){
			var color = new dojo.Color(a_color);
			var fac = a_factor;
			color.r = Math.floor(color.r*fac);
			color.g = Math.floor(color.g*fac);
			color.b = Math.floor(color.b*fac);
			return color.toHex();			
		},
		
		draw : function(){
			var dim = this._getDim();
			
			this._socketShape = this.createRect({
				x: this._position.x - Math.round(dim.width/2),
				y: this._position.y - Math.round(dim.height/2),
				width: dim.width,
				height: dim.height,
				r:dim.roundedCorner
			}).setFill(this._fill).setStroke(this._stroke);		
			/*
			this._socketShape = this.createCircle({
				cx: this._position.x ,
				cy: this._position.y ,
				r: 6
			}).setFill(this._socketModel.getType().getColor()).setStroke(stroke);		
		*/
		},
		
		moveToFront : function(){
			this.getShape().moveToFront();
			this.onMoveToFront();
		},
		
		select : function(){
			this._socketShape.setFill(this._getDim().selectedFill).setStroke(this._getDim().selectedStroke);
		},
		
		deselect : function(){
			this._socketShape.setFill(this._fill).setStroke(this._stroke);
		},
		
		onClick : function(){
			console.log(" I was clicked! ");
			dojo.publish("view/program/Socket/Clicked", [this]);
		},
		
		onMove : function(){
			//console.log(" I am moving!"+this.getModel().getId());
		},
		
		onMoveToFront : function(){
			
		},
		
		_getDim : function(){
			return cs.view.program.Socket.dim;
		},
		
		getModel : function(){
			return this._socketModel;
		}
		
	});
	
	cs.view.program.Socket.dim = {
		width: 16, 
		height : 12,
		roundedCorner: 6,
		stroke : {
					color: "#777",
					width: 2,
					join: "round"
			},		
		collectionStroke : {
				color: "#111",
				width: 3,
				join: "round"
		},
		selectedStroke : {
				color: "#0ff",
				width: 2,
				join: "round"			
		},
		selectedFill : "#066"
		};