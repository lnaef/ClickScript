/**
 * @author elcc
 * 
 * CS.CONTROLLER.EXECUTIONCONTROLLER - This class represents a controller to update the execution model
 * 
 */
	
	dojo.provide("cs.controller.ExecutionController");
	
	dojo.require("cs.util.Container");
	dojo.require("cs.controller.ModelController");
	dojo.require("cs.model.exec.Block");
	dojo.require("cs.model.exec.Module");
	dojo.require("cs.model.exec.Statement");
	dojo.require("cs.controller.ModelControllerObserver");
	dojo.require("cs.controller.Worklist");
	
	dojo.declare("cs.controller.ExecutionController", cs.controller.ModelControllerObserver, {
		
		_modelController : null,
		
		/**
		 * List of all exec-components
		 */
		_components : null,
		_rootBlock : null,
		_rootStatement : null,
		
		/**
		 * working list
		 */
		_worklist : null,
		
	
		constructor : function(a_modelController){
			
			// init values
			this._modelController = a_modelController;
			
			this._components = new cs.util.Container();
			

			this._rootStatement = new cs.model.exec.Statement(this._modelController.getRootStatement(),null);
			this._rootBlock = this._rootStatement.getBlocks().item(0);
			
			// adds root statement to the components container
			this._components.add(this._rootStatement);
			
			
			this._worklist = new cs.controller.Worklist(this._rootStatement);
			
			// register round updater
			
			/**
			 * TODO: REMOVE, DEPRICATED SINCE 0.5
			 */
			dojo.connect(this.getWorklist(),"onNewRun",this,function(){
				if(dojo.byId("runCounter")){
					dojo.byId("runCounter").innerHTML = (this.getWorklist().getRunCounter());
				} else {
					this.write("NEW ROUND: "+this.getWorklist().getRunCounter());
				}
			});
			dojo.connect(this.getWorklist(),"onStateChange",this,function(state){
				if(dojo.byId("csState")){

					dojo.query(".csStateIcon").style("display","none");
					dojo.style(dojo.byId("csState"+state),"display","inline");
				} else {
					this.write("STATE changed to: "+state);
				}
			});
			
			

			
		},
		
		getWorklist : function(){
			return this._worklist;
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
		
		run : function(){
			this.getWorklist().reset();
			this.getWorklist().run();
		},		
		
		repeatedRun : function(){
			this.getWorklist().reset();
			this.setRepeatedRun(true);
			this.getWorklist().run();
		},
		
		setRepeatedMode : function(a_value){
			this.getWorklist().setRepeatedRun(a_value);
		},
		
		getRepeatedMode : function(){
			return this.getWorklist().getRepeatedRun();
		},
		
		stop : function(){
			this.getWorklist().stop();
		},
		
		onAddComponent : function(a_component){
			var component = null;
			if (a_component.isStatement()){
				component = new cs.model.exec.Statement(a_component,this._rootBlock);				
			} else {
				component = new cs.model.exec.Module(a_component,this._rootBlock);				
			}

			this._components.add(component);
			
			// add new component to the root Block
			this._rootBlock.addComponent(component);
			this.writeDebug("Exec-Model : New component added '"+a_component.getMetaData().getName()+"'");
			return component;
		},
		
		onConnectSockets : function(a_wire,a_socket1, a_socket2){
			var s1 = this._getSocketExec(a_socket1);
			var s2   = this._getSocketExec(a_socket2);
			s1.connectTo(s2);
			s2.connectTo(s1);
			
			this.writeDebug("Exec-Model : Sockets connected");
		},
		
		onMoveComponentToBlock : function(a_component,a_toBlock){
			var component = this._getComponentExec(a_component);
			var block     = this._getBlockExec(a_toBlock);
			
			// delete component from old block
			var parent = this._getParentBlock(component);
			parent.removeComponent(component);
			
			// add component to new block
			block.addComponent(component);
			
			this.writeDebug("Exec-Model : Moved component from block '"+parent.getModel().getMetaData().getName()+"' to block '"+block.getModel().getMetaData().getName()+"'");
		},
		
		
		onDeleteComponent : function(a_model_component){
			var component = this._getComponentExec(a_model_component);
			component.destroy();
		},
		
		onDeleteWire : function(a_model_wire,a_from,a_to){
			var socket1 = this._getSocketExec(a_from);
			var socket2 = this._getSocketExec(a_to);
			socket1.removeConnection(socket2);
			socket2.removeConnection(socket1);
			this.writeDebug("Exec-Model : Removed connection...");
		},
		
		onUpdateFieldSocket : function (a_model_value_socket){
			/* not needed in execution controller*/
			//var socketshape = this._getSocketShape(a_model_value_socket);
			//socketshape.draw();
		},
		
		onFocusComponent : function(a_model_component){
			var component = this._getComponentExec(a_model_component);
			if(component.hasView()){
				component.getView().highlightOn();
			}
		},
		
		onBlurComponent : function(a_model_component){
			var component = this._getComponentExec(a_model_component);
			if(component.hasView()){
				component.getView().highlightOff();			
			}
		},
		
		onUpdatePositionProg : function(a_module, a_x, a_y){

		},
		
		onUpdatePositionExec : function(a_module, a_x, a_y){

		},
		
		onUpdateData : function(a_module, a_data){

		},
		
		/**
		 * Returns the corresponding Exec Socket to a_model_socket
		 * @param {cs.model.program.Socket} a_model_socket Model socket we are looking for its shape
		 */
		_getSocketExec : function(a_model_socket){
			//todo: do not loop through all the loops allways
			var result = null;
			this._components.forEach(function(component){
				// todo: new function forEachSocket on cs.view.program.Component
				component.getInputs().forEach(function(input){
					if(a_model_socket == input.getModel()){
						result = input;
					}
				},this);
				component.getOutputs().forEach(function(output){
					if(a_model_socket == output.getModel()){
						result = output;
					}
				},this);
			},this);
			return result;
		},
		
		/**
		 * Returns exec.Component of a program.Component
		 * @param {cs.model.program.Component} a_model_component
		 */
		_getComponentExec : function(a_model_component){
			var result = null;
			this._components.forEach(function(component){
				if(component.getModel() == a_model_component){
					result = component;
				}
			},this);
			return result;
		},
		
		/**
		 * Returns exec.Block of a program.Block
		 * @param {cs.model.program.Block} a_model_block
		 */
		_getBlockExec : function(a_model_block){
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
		
		/**
		 * Get parent exec-Block of a exec component
		 * @param {cs.model.exec.Component} a_exec_component
		 */
		_getParentBlock : function(a_exec_component){
			var result = null;
			
			
			this._components.forEach(function(component){
				if (component.getModel().isStatement()) {
					component.getBlocks().forEach(function(block){
						if (block.hasComponent(a_exec_component)) {
							result = block;
						}
					});
				}
			},this);
			return result;			
		}
			
	});