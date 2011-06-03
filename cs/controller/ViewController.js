/**
 * @author elcc
 * 
 * @todo: modules now have an id, we can put them in a map on the id to be faster in catching them
 * 
 */
	
	dojo.provide("cs.controller.ViewController");
	
	dojo.require("cs.util.Container");
	dojo.require("cs.view.program.Component");
	dojo.require("cs.view.program.Wire");
	dojo.require("cs.view.program.Statement");
	dojo.require("cs.controller.ModelControllerObserver");
	
	//for tooltips:
	dojo.require("cs.view.util.Tooltip");
	
 	dojo.declare("cs.controller.ViewController", cs.controller.ModelControllerObserver, {
		
		_components : null,
		_wires : null,
		
		_surface : null,
		_zoomSurface : null,
		
		_modelController : null,
		
		/**
		 * Tooltip for description, content loaded dynamically
		 */
		_tooltip : null,
		
		/**
		 * Selected items on the controller
		 */
		selector: {
			socket: null,
			field : null,
			wire: null
			
		},
		
		/**
		 * Navi data: 
		 *  - zoom : scale value of the surface
		 *  - dx   : x transformation of the surface
		 *  - dy   : y transformation of the surface
		 */
		navi : {
			zoom : null,
			dx : null,
			dy : null
		},
		
		constructor : function(a_surface, a_modelController){
			
			// init containers
			this._components = new cs.util.Container();
			this._wires = new cs.util.Container();
			
			// init initial values
			this._surface = a_surface;
			this._zoomSurface = this._surface.createGroup();
			this._modelController = a_modelController;
			
			//register surface as component of root statement
			dojo.subscribe("/cs/dnd/ondrop",this,"onCsDndDrop");
			
			// subscribe to event onSocketClicked
			dojo.subscribe("view/program/Socket/Clicked", this, "onSocketClicked");
			dojo.subscribe("view/program/Field/Clicked", this, "onFieldClicked");
			dojo.subscribe("view/program/Wire/Clicked", this, "onWireClicked");
			dojo.subscribe("view/program/Component/Remove/Clicked", this, "onRemoveComponentClicked");
			dojo.subscribe("view/program/Field/Updated",this,"onFieldUpdate");
			dojo.subscribe("view/program/Block/ComponentSwitchBlock",this,"onComponentSwitchedBlock");
			
			dojo.subscribe("view/program/mouseenter",this,"onComponentMouseEnter");
			dojo.subscribe("view/program/mouseleave",this,"onComponentMouseLeave");
			
			
			// init tooltip for description of modules
			//this._tooltip = new dijit.Tooltip({connectId : "csExecutionView",label:"hello",showDelay:1});
			this._tooltip = new cs.view.util.Tooltip();
			
			// ready to work
			this.writeDebug("View Controller activated");
			
			// navi
			this.navi.dx = 0;
			this.navi.dy = 0;
			this.navi.zoom = 1;
			
			// MAYBE it works with mover see testbench.html and without the zooming surface!
			//this.zoomView(1.2);
			//this.moveView(100,30);
			//this.moveView(-100,-30);
			/*
			var moveable = new dojox.gfx.Moveable(this._surface);
			var navi = this._surface.createRect({x:20,y:20,width:10,height:10}).setFill("#f00");
			dojo.connect(moveable,"onMove",function(event,coords){
				
				// The transformmatrix of the surface we place the wires
				var real = navi._getRealMatrix();
				
				// if there is no transformmatrix on the surface, take the neutral matrix
				if (!real){
					real =  {xx:1,xy:0,yx:0,yy:1,dx:0,dy:0};
				}
				
				navi.applyLeftTransform(dojox.gfx.matrix.translate(-coords.dx*(1/real.xx),-coords.dy*(1/real.yy)));
			})*/
		},
		
		
		/**
		 * NAVIGATION PART - like zoom or move
		 */
		zoomView : function(a_scale_value){
			this._zoomSurface.applyLeftTransform(dojox.gfx.matrix.scale(a_scale_value,a_scale_value));
			this.navi.zoom = a_scale_value;
		},
		
		moveView : function(a_dx, a_dy){
			this._surface.applyLeftTransform(dojox.gfx.matrix.translate(a_dx,a_dy));
			this.navi.dx = a_dx;
			this.navi.dy = a_dy;
		},
		
		
		/**
		 * Write a_text to console
		 * @param {String} a_text
		 */
		write : function(a_text){
			cs.console.write(a_text);
		},
		
		/**
		 * Write a_text to console if this.debug is true
		 * @param {String} a_text
		 */
		writeDebug : function(a_text){
			cs.console.writeDebug(a_text);
		},
		
		/**
		 * Gets called if a move of a component stops
		 * @param {cs.view.program.Component} a_component Component which was moved
		 * @param {Object} a_mover     Moverevent
		 */		  
		 onCsDndDrop : function(a_component, a_mover){
			this.writeDebug("block checked: "+a_component.getModel().getMetaData().getName());
			var componentBB = a_component.getShape().getTransformedBoundingBox();
			var moveToBlock = null;
			
			this._components.forEach(function(component){
				if (component.getModel().isStatement()) {
					component.getBlocks().forEach(function(block){
						// if dropped component is inside this block
						// because if a shape inside the group is larger than the group it won't take the
						// border of the inner element >
						//if(this.isBoundingBoxInside(block.getShape().getTransformedBoundingBox(),componentBB)){
						if(this.isBoundingBoxInside(block.getBlockShape().getTransformedBoundingBox(),componentBB)){
							// select the one which is the block on the top!
							moveToBlock = block;
						}
					},this);
				}
			},this);
			
			// only if hole component covers the shape
			if (moveToBlock != null){
				// only move if it is an other block then before
				if(moveToBlock.getModel()!=a_component.getModel().getParentBlock()){
					console.log("Let's move a module to an other block");
					dojo.publish("view/program/Block/ComponentSwitchBlock",[a_component.getModel(),moveToBlock.getModel()]);
				} else {
					console.log("stays in same block");
				}
			} else {
				// we did not find a block we can put in, so we put it to the program block
				console.log("Let's move a component to the top program layer");
				dojo.publish("view/program/Block/ComponentSwitchBlock",[a_component.getModel(),this._modelController.getRootBlock()]);
	
			}
		},
		
		/**
		 * True if a_innerBB (Transformed Boundingbox) is inside a_outerBB
		 * @param {Transformed Boundingbox} a_outerBB
		 * @param {Transformed Boundingbox} a_innerBB
		 */		
		isBoundingBoxInside : function(a_outerBB,a_innerBB){
			return a_innerBB[0].x > a_outerBB[0].x && a_innerBB[1].x < a_outerBB[1].x && a_innerBB[0].y > a_outerBB[0].y && a_innerBB[2].y < a_outerBB[2].y;
		},
		
		
		/**
		 * This method is fired if someone clicks on a Socket
		 * @param {cs.view.program.Socket} a_socket_shape Socket the user clicked on
		 */
		onSocketClicked : function(a_socket_shape){
			
			// if already a socket is selected
			if(this.selector.socket){	
						
				// only allow connection if from-to sockets are not the same!
				if (this.selector.socket != a_socket_shape) {
					var wire = this._modelController.connectSockets(this.selector.socket.getModel(), a_socket_shape.getModel());
					this.selector.socket.deselect();
					this.selector.socket = null;
				} else {
					// user tries to connect from and to the same socket
					this.selector.socket = null;	
					this.writeDebug("Connecting to its own socket is not allowed");
				}
				//anyway deselect
				a_socket_shape.deselect();
				
			// is first selected socket
			} else {
				this.selector.socket = a_socket_shape;
				this.selector.socket.select();
				dojo.publish("controller/viewController/activeSocket");
				this.writeDebug("First Socket selected...");
			}
		},
		
		onWireClicked : function(a_wire_shape){
			if(this.selector.wire == a_wire_shape){
				this._modelController.deleteWire(a_wire_shape.getModel());
				this.selector.wire = null;
				//TODO: SELECT WIRE SHOULD BE IMPLEMENTED LIKE: select/deselect
			} else {
				this.selector.wire = a_wire_shape;
				this.writeDebug("Wire selected");
			}
			
		},
		
		onFieldClicked : function(a_value_socket_shape){
			
			// abort reading of old socket if needed
			if(this.selector.field && this.selector.field.isReading()){
				
				// abort reading
				this.selector.field.abortReading();
				
				// deselect
				this.selector.field.setSelected(false);
				
				// redraw
				this.selector.field.draw();
			}	
			
			// set selector to the new socket
			this.selector.field = a_value_socket_shape;
			
			// on first click start reading
			if(a_value_socket_shape.isSelected()){
				this.selector.field.startReading();	
			
				
				
			// deselect the value socket
			} else {				
				if (this.selector.field.isReading()) {
					this.selector.field.abortReading();
				}
				this.selector.field = null;
			}		
		},
		
		onFieldUpdate : function(a_value_socket_shape, value){
			this.writeDebug("new value");
			this._modelController.updateFieldSocket(a_value_socket_shape.getModel(),value);
		},
		
		onComponentSwitchedBlock : function(a_component_model, a_block_model){
			this._modelController.moveComponentToBlock(a_component_model,a_block_model);
		},
		
		onRemoveComponentClicked : function(a_component_shape){
			console.log("VIEW CONTROLLER: REMOVE COMPONENT CLICKED");
			this._modelController.deleteComponent(a_component_shape.getModel());
		},
		
		/*   FUNCTIONS INTERFACE FOR MODELCONTROLLER
		 */
		onAddComponent : function(a_component){
			if (a_component.isStatement()){
				var component = new cs.view.program.Statement(this._surface,a_component.getPositionProg(),a_component);				
			} else {
				var component = new cs.view.program.Component(this._surface,a_component.getPositionProg(),a_component);				
			}

			this._components.add(component);

			
			this.writeDebug("New component '"+a_component.getMetaData().getName()+"' added id: "+ a_component.getUid());
		},
		
		onConnectSockets : function(a_wire,a_socket1, a_socket2){
			var from = this._getSocketShape(a_socket1);
			var to   = this._getSocketShape(a_socket2);
			
			var wire = new cs.view.program.Wire(this._surface,from,to,a_wire);
			this._wires.add(wire);
			this.writeDebug("Sockets connected..."+(wire.isValidConnection()?"Connection OK":"Invalid connection!"));
			return wire;
		},
		
		onMoveComponentToBlock : function(a_component,a_toBlock){
			var component = this._getComponentShape(a_component);
			
			if (a_toBlock != this._modelController.getRootBlock()) {
				var block = this._getBlockShape(a_toBlock);
				/*
				tcomp = component.getTransformedBoundingBox();
				tcont = block.getTransformedBoundingBox();
				
				rec = function(tt){
					return {
						x: tt[0].x,
						y: tt[0].y,
						width: tt[1].x - tt[0].x,
						height: tt[2].y - tt[0].y
					}
				}
				console.log("rec", rec(tcomp), tcomp);
				//cs.test.drawRect(rec(tcomp));
				//cs.test.drawRect(rec(tcont));
				//PROBLEM
				*/
				block.addComponent(component);
			} else {
				// move to program top layer
				this._getComponentShape(a_component).setParentBlock(this._surface);
			}
		},
		
		
		onDeleteComponent : function(a_model_component){
			var component = this._getComponentShape(a_model_component);
			component.destroy();
		},
		
		onDeleteWire : function(a_model_wire){
			console.log(a_model_wire);
			var wire = this._getWireShape(a_model_wire);
			wire.getShape().removeShape();
			wire.destroy();
			this.writeDebug("Removed wire...");
		},
		
		onUpdateFieldSocket : function (a_model_value_socket){
			var socketshape = this._getSocketShape(a_model_value_socket);
			socketshape.draw();
		},
		
		// executed on mouse in and out of a component
		onComponentMouseEnter : function(a_component_model){
			this._modelController.focusComponent(a_component_model);
		},
		onComponentMouseLeave : function(a_component_model){
			this._modelController.blurComponent(a_component_model);
		},
		
		onUpdatePositionProg : function(a_module, a_x, a_y){
			this._getComponentShape(a_module).moveTo(a_x,a_y);
		},
		
		onUpdatePositionExec : function(a_module, a_x, a_y){
			
		},
		
		onUpdateBlockDimension : function(a_blockModel){
			console.log("dimension of block UID"+a_blockModel.getOwner().getUid());
			this._getComponentShape(a_blockModel.getOwner()).resizeBlocks();
		},
		
		onUpdateData : function(a_module, a_data){

		},
		
		/**
		 * Returns the corresponding Shape to a_model_socket
		 * @param {cs.model.program.Socket} a_model_socket Model socket we are looking for its shape
		 */
		_getSocketShape : function(a_model_socket){
			//todo: do not loop through all the loops allways
			var result = null;
			this._components.forEach(function(module){
				// todo: new function forEachSocket on cs.view.program.Component
				module.getInputSockets().forEach(function(inputSocket){
					if(a_model_socket == inputSocket.getModel()){
						result = inputSocket;
					}
				},this);
				module.getOutputSockets().forEach(function(outputSocket){
					if(a_model_socket == outputSocket.getModel()){
						result = outputSocket;
					}
				},this);
				module.getFieldSockets().forEach(function(fieldSocket){
					if(a_model_socket == fieldSocket.getModel()){
						result = fieldSocket;
					}
				},this);
			},this);
			return result;
		},
		
		/**
		 * Returns the corresponding Shape to a_model_wire
		 * @param {cs.model.program.Wire} a_model_wire The Model of the Wire we are looking for
		 */
		_getWireShape : function(a_model_wire){
			var result = null;
			this._wires.forEach(function(wire){
				if(wire.getModel() == a_model_wire){
					result = wire;
				}
			},this);
			return result;
		},
		
		
		_getComponentShape : function(a_model_component){
			var result = null;
			this._components.forEach(function(component){
				if(component.getModel() == a_model_component){
					result = component;
				}
			},this);
			return result;
		},
		
		
		_getBlockShape : function(a_model_block){
			var result = null;
			this._components.forEach(function(component){
				if (component.getModel().isStatement()) {
					component.getBlocks().forEach(function(block){
						if (block.getModel() == a_model_block) {
							result = block;
						}
					});
				}
			},this);
			return result;
		},
		
		getSurface : function(){
			return this._surface;
		},
		
		getTooltip : function(){
			return this._tooltip;
		}
		
	});