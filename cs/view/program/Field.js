/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Field");
	
	dojo.require("cs.view.util.Shape");
	dojo.require("cs.view.util.InputTextHandler");
	
	dojo.declare("cs.view.program.Field", cs.view.program.Socket, {
		
		
		_textshape : null,
		_fieldshape : null,
		
		/*
		 * True if this Socket was clicked
		 */
		_isSelected : null,
		
		_inputfield : null,
		
		/**
		 * Creates new shape
		 * @param {dojox.gfx.Shape} a_rawNode
		 * @param {{x,y}} a_position
		 * @param {cs.model.program.Socket} socketModel
		 */
		constructor : function(a_csViewGroup,a_position,a_socketModel){
			
			this._isSelected = false;
			this.draw(); // TODO
			this._inputfield = new cs.view.util.InputTextHandler(null,this._textshape);
			dojo.connect(this._inputfield,"onAfterReading",this,function(value){
				this._isSelected = false;
				this.draw();
				dojo.publish("view/program/Field/Updated", [this,value]);
			});
			dojo.connect(this._inputfield,"onAbortReading",this,function(value){
				dojo.publish("view/program/Field/Updated", [this,value]);
			});
		},

		
		draw : function(){
			var dim = this._getDim();
			
			// width of the value socket field is width of the module if not selected
			// text-length otherwise
			var width = dim.width;
			if(this.isSelected()){
				// dirty hack to enable getTextWidth()
				this._textshape.getShape().text = this._textshape.getShape().text+"...";
				this._textshape.setShape(this._textshape.getShape());
				width = this._textshape.getTextWidth();//dim.letterwidth * this.getValue().length+dim.textOffsetX;
				width = (width > dim.width)? width : dim.width;
			}
			
			if (this._fieldshape) {
				// scale if needed
				var x = this._fieldshape.getShape().x; //correcture
				var scaleX = width / this._fieldshape.getShape().width;
				
				var fshape = this._fieldshape.getShape();
				    fshape.width = width;
				this._fieldshape.setShape(fshape);
				//this._fieldshape.setTransform({xx: scaleX, xy: 0, yx: 0, yy: 1, dx: -x * (scaleX-1), dy: 0});//.width = width;
				
				// change color to white in case of writing
				var color = this.isReading() ? "#fff" : this._getDim().fill;
				this._fieldshape.setFill(color).setStroke(dim.stroke);
			}
			else {
			
				// redraw field
				this._fieldshape = this.createRect({
					x: this._position.x,
					y: this._position.y,
					width: width,
					height: dim.height,
					r:dim.roundCorner
				}).setFill(dim.fill).setStroke(dim.stroke);
			}
			
			// write the value from the model if selected in full length
			// in width of module otherwise
			var value = this.getValue()+(this.isSelected()?"<":"");
			
			if(!this.isSelected()){
				// Number of letters to be displayed if not selected
				var cut = (Math.floor((dim.width-dim.textOffsetX)/dim.letterwidth)<value.length) ? Math.floor((dim.width-dim.textOffsetX)/dim.letterwidth) : value.length;
				
				// Only take the first few letters
				value = value.substring(0,cut);
			}
			
			// remove old shape
			if (this._textshape) {
				var shape = dojo.clone(this._textshape.getShape());
				shape.text = value;
				this._textshape.setShape(shape);
			}
			else {
			
				// write
				// @ use vector font
				this._textshape = this.createText({
					x: this._position.x + dim.textOffsetX,
					y: this._position.y + dim.height - Math.round((dim.height - 10) / 2)-1,
					text: value,
					align: "left"
				}).setFont(dim.font.style).setFill(dim.font.fill);
			}
		},
		
		// Lets change the socket value
		startReading : function(){
				this._inputfield.focus();
				this._inputfield.setValue(this.getModel().getValue());
				this._inputfield.read();
				console.log("field on?",this._inputfield.isReading());
				this.draw();			
		},
		
		// Abort reading for example if user did not press ENTER and clicked on a new field
		abortReading : function(){
			    
				this._inputfield.abort();	
				
		},
		
		// True if shape is in reading mode
		isReading : function(){
			return this._inputfield.isReading();
		},
		
		/**
		 * Change selection of the socket value
		 * Expand text or not
		 */
		onClick : function(){
			console.log(" value socket was clicked! ");
			this._isSelected = !this.isSelected();	
			
			this.draw();
			dojo.publish("view/program/Field/Clicked", [this]);
		},
		
		_getDim : function(){
			return cs.view.program.Field.dim;
		},

		isSelected : function(){
			return this._isSelected;
		},
		
		setSelected : function(value){
			this._isSelected = value;
		},
		
		getValue : function(){
			return this.getModel().getValue();
		}
	});
	
	cs.view.program.Field.dim = {
		width: 60, 
		height : 15,
		textOffsetX : 6,
		letterwidth: 6, // average width per letter
		roundCorner: 7,
		stroke : 
		{
			color: "#aaa",
			width: 1,
			join: "round"
		},
		fill : "#eee",
		font: {
			style: {
				family: "monospace",
				size: "10px",
				weight: "normal"
			},
			fill : "#555" 
			
		}
		};