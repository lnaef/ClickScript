/**
 * @author elcc
 */
	dojo.provide("cs.view.program.Component");
	
	dojo.require("dojox.gfx.move");
	dojo.require("cs.view.util.Shape");
	dojo.require("cs.view.program.Socket");
	dojo.require("cs.view.program.Field");
	
	dojo.declare("cs.view.program.Component", cs.view.util.Shape, {

		
		/**
		 * Model of this View
		 */
		_moduleModel : null,
		
		_inputSockets : null,
		_outputSockets : null,
		_fieldSockets : null,
		
		_position : null,
		
		_moveable : null,
		_moveableEvents : null,
		
		_image: null,
		_infoIcon : null,
		_removeIcon: null,
		
		
		/**
		 * Creates new shape
		 * @param {dojox.gfx.Shape|cs.view.utilGroup} a_rawNode
		 * @param {{x,y}} a_centerPos
		 * @param {cs.model.program.Component} moduleModel
		 */
		constructor : function(a_csViewGroup,a_centerPos,moduleModel){
			this._moduleModel = moduleModel;
			
			this._position = a_centerPos;
			
			this.draw();
					
			// register onMove events of the mover
			// todo: remove the event
			this.connectMover();

			
			// move to front if some one clicks on a component
			// bug in ie, if we attach event onmousedown > onclick won't work on all sub-shapes!
			if(!dojo.isIE){
				this.getShape().connect("onmousedown",this,"moveToFront");
			} else {
				this.getShape().connect("onclick",null,function(){});
			}
			
			//register events for mouse in and out
			this.getShape().connect("onmouseenter",this,function(){dojo.publish("view/program/mouseenter",[this.getModel()]);});
			this.getShape().connect("onmouseleave",this,function(){dojo.publish("view/program/mouseleave",[this.getModel()]);});
		},

		/**
		 * Move the component shape on top level including its sockets
		 */
		moveToFront : function(){			
			this.getShape().moveToFront();
			this._inputSockets.forEach(function(item){
				item.moveToFront();
			});
			this._outputSockets.forEach(function(item){
				item.moveToFront();
			});
			this._fieldSockets.forEach(function(item){
				item.moveToFront();
			});
			if(this._image){
				this._image.moveToFront();
			}
			cs.console.writeDebug("Moved Component "+ this.getModel().getUid() + " to the front");
		},
		
		/**
		 * @todo make this function multi-usable problem that every time new sockets get generated
		 */
		draw : function(){
			var dim = this._getDim();
			
			var height = this.getModel().isPrimitive() ? 6+cs.view.program.Field.dim.height*Math.max(this.getModel().getOutputSockets().size(),this.getModel().getFieldSockets().size()) : dim.height;
			var width = this.getModel().isPrimitive() ? 13+cs.view.program.Field.dim.width  : dim.width-2*dim.paddingLeftRight;
			var body = {
				x: this._position.x - Math.round(dim.width/2)-dim.paddingLeftRight,
				y: this._position.y - Math.round(dim.height/2),
				width: width,
				height: height,
				r: this.getModel().isPrimitive() ? Math.floor(height/2): dim.roundCorner
			};
			
			//draw module
			var color = this.getModel().isPrimitive() ? this.getModel().getFieldSockets().get(0).getType().getColor() : dim.fill;
			this.createRect(body).setFill(color).setStroke(dim.stroke);

			// create Sockets
			this._inputSockets = new cs.util.Container();
			this._outputSockets = new cs.util.Container();
			this._fieldSockets = new cs.util.Container();

			this.getModel().getInputSockets().forEach(function(socketModel,index){
				var socket = new cs.view.program.Socket(this, {x : +body.x + Math.round(cs.view.program.Socket.dim.width/2) - dim.paddingLeftRight, y : body.y + index * (dim.socketMargin + cs.view.program.Socket.dim.height) +dim.paddingTopBottom},socketModel);
				
				// add shape
				this.add(socket);
				
				// add socket to input container		
				this._inputSockets.add(socket);
			},this);
			
			var marginTop = (this.getModel().isStatement())?25:0;
			this.getModel().getOutputSockets().forEach(function(socketModel,index){
				var socket = new cs.view.program.Socket(this, {x : body.x + body.width-Math.round(cs.view.program.Socket.dim.width/2)+ dim.paddingLeftRight, y : body.y + index * (dim.socketMargin + cs.view.program.Socket.dim.height)+dim.paddingTopBottom+marginTop+(this.getModel().isPrimitive()?-1:0)},socketModel);
				this.add(socket);
				this._outputSockets.add(socket);
			},this);
			this.getModel().getFieldSockets().forEach(function(socketModel){
				var field = new cs.view.program.Field(this, {x:  body.x + (dim.width-cs.view.program.Field.dim.width)/2-dim.paddingLeftRight+(this.getModel().isPrimitive()?3:0), y: body.y + body.height - (socketModel.getMetaData().getPosition()+1)*cs.view.program.Field.dim.height-(this.getModel().isPrimitive()?3:0)},socketModel);
				this._fieldSockets.add(field);
			},this);
			
			
			//draw picture
			if (!this.getModel().isPrimitive()) {
				var imgPath = this.getModel().getMetaData().getImgPath();
				if (!imgPath) {
					imgPath = dim.pic.defaultPath;
				}
				var imgPath = dim.pic.root + imgPath;
				this._image = this.getShape().createImage({
					src: imgPath,
					width: dim.pic.width,
					height: dim.pic.height,
					x: body.x + Math.round((body.width - dim.pic.width) / 2) + dim.pic.x + dim.pic.x,
					y: body.y + dim.pic.y
				});
				
				// hotfix : in svg (ff3.5) image is not displayed if attribute fill="none" in svg:image
				// dojo in setRawNode sets it per default.
				if (dojox.gfx.renderer == "svg") {
					this._image.rawNode.removeAttribute("fill");
				}
			}
			
			// delete icon
			this._removeIcon = this.getShape().createImage({
				src:  dim.remove.path,
				width: dim.remove.width,
				height: dim.remove.height,
				x:  body.x + body.width- dim.remove.width - 1 ,
				y: body.y + body.height - dim.remove.height -1 - ((!this.getModel().isPrimitive())?this.getModel().getFieldSockets().size()*cs.view.program.Field.dim.height:0)
			});
			if (dojox.gfx.renderer == "svg") {
				this._removeIcon.rawNode.removeAttribute("fill");
			}
			// todo remove connection before redraw!
			this._removeIcon.connect("onclick",this,
					function(e){
						dojo.publish("view/program/Component/Remove/Clicked", [this]);
					}
			);

			// Tooltip Info icon
			if (!this.getModel().isPrimitive()) {
				
				// tooltip icon
				this._infoIcon = this.getShape().createImage({
					src:  dim.tooltip.path,
					width: dim.tooltip.width,
					height: dim.tooltip.height,
					x: body.x + body.width - dim.tooltip.width - 1 -2 - dim.remove.width,
					y: body.y + body.height - dim.tooltip.height -1 - this.getModel().getFieldSockets().size()*cs.view.program.Field.dim.height
				});
				
				
				// hotfix : in svg (ff3.5) image is not displayed if attribute fill="none" in svg:image
				// dojo in setRawNode sets it per default.
				if (dojox.gfx.renderer == "svg") {
					this._infoIcon.rawNode.removeAttribute("fill");
				}
				
				// todo change cs.viewController 
				this._infoIcon.connect("onclick",this,
						function(e){
							var tooltip = cs.viewController.getTooltip();
							var text = this.getModel().getDescriptionAsHTML();
							if(tooltip.isOn()&&tooltip.getText()==text){
								tooltip.hide();
							} else {
								tooltip.show(e,text);
							}});
				
			}
			this.hideIcons();
			this.getShape().connect("onmouseenter",this,"showIcons");
			this.getShape().connect("onmouseleave",this,"hideIcons");
		},
				
	
		
		showIcons : function(){
			// just to make sure
			this.hideIcons();
			
			// remove icon
			this.getShape().add(this._removeIcon);
			this._removeIcon.moveToFront();
			
			// info icon
			if (this._infoIcon){
				this.getShape().add(this._infoIcon);
				this._infoIcon.moveToFront();
			}
		},
		
		hideIcons : function(){
			if(this._infoIcon){
				this._infoIcon.removeShape();
			}
			this._removeIcon.removeShape();
			/*
			if (this._infoIcon){
				this._infoIcon.moveToBack();
				cs.viewController.getTooltip().hide();
			};
			this._removeIcon.moveToBack();
			*/
			
		},
		

		
		_getDim : function(){
			return cs.view.program.Component.dim;
		},
		
		/**
		 * Disconnect the mover from the shape
		 */
		disconnectMover : function(){
			if(this._moveable){
				this._moveable.destroy();
				this._moveable = null;
			}
			dojo.forEach(this._moveableEvents,function(item){
				dojo.disconnect(item);
			});
			this._moveableEvents=[];
		},
		
		/**
		 * Instantiate new Mover (delete old one if available)
		 */
		connectMover : function(){			
			
			// make sure we don't register a mover twice
			this.disconnectMover();
			
			var moveable = new dojox.gfx.Moveable(this.getShape());
			
			this._moveable = moveable;
			
			this._moveableEvents.push(dojo.connect(moveable,"onMove",this,"onMove"));
			this._moveableEvents.push(dojo.connect(moveable,"onMoveStop",this,function(mover){
				dojo.publish("/cs/dnd/ondrop",[this,mover]);
				//Todo: REMOVE THIS ON DISCONNECT
			}));
		},
		
		_consParentBlock : null,
		
		setParentBlock : function(a_block){
			if(this._consParentBlock){
				dojo.forEach(this._consParentBlock,dojo.disconnect);
				this._consParentBlock = null;
			}
			this._consParentBlock = [];
			this._consParentBlock.push(dojo.connect(a_block,"moveToFront",this,"moveToFront"));
			this._consParentBlock.push(dojo.connect(a_block,"onMove",this,"onMove"));
			this._consParentBlock.push(dojo.connect(a_block,"onMove",this._moveable,"onMove"));
		},
		
		/**
		 * Getters
		 */
		getInputSockets : function(){return this._inputSockets;},
		getOutputSockets : function(){return this._outputSockets;},
		getFieldSockets : function(){return this._fieldSockets;},
		getModel : function(){return this._moduleModel;}
	});
	
	cs.view.program.Component.dim ={ 
				width: 80,   	 //of module
				height : 90,	 //of module
				paddingLeftRight : 10,	 //left and right for sockets
				paddingTopBottom : 12,  // top and bottom for sockets
				socketMargin : 10, //between sockets,
				roundCorner: 4,
				stroke : {
					color: "rgba(129,129,129,0.8)",
					width: 1,
					join: "round"
				},
				fill : "rgba(190,190,190,0.8)", // opacity to 0.8!
				pic : {
					x:0,          //derivation from the center
					y:2,
					height:48,
					width:48,
					defaultPath : "default.gif",
					root : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ) + "lib/",
					info : "info.png"
				},
				tooltip : { // icon
					path : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ) + "util/images/info.png",
					width: 16,
					height: 16
				},
				remove : { // icon
					path : ((dojo.config && dojo.config.modulePaths && dojo.config.modulePaths.cs && dojo.config.baseUrl) ? dojo.config.baseUrl + dojo.config.modulePaths.cs : "./lib/dojo/cs/" ) + "util/images/delete.png",
					width: 16,
					height: 16
				}
				};