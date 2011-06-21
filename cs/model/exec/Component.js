/**
 * @author elcc
 * 
 * cs.model.program.Component - This class represents a Component with its inputs, outputs and fields
 * each component has also a link to a metadata object with its type specific information. A component is either 
 * a Module or a Statement
 */
	
	dojo.provide("cs.model.exec.Component");
	
	dojo.require("cs.util.Container");
	dojo.require("cs.model.exec.OutputSocket");
	dojo.require("cs.model.exec.InputSocket");
	dojo.require("cs.model.exec.FieldSocket");
	
	dojo.declare("cs.model.exec.Component", null, {
		
		/**
		 * All Sockets of a component
		 * @type : cs.util.Container[cs.model.exec.Socket]
		 */
		_inputs : null,
		_outputs : null,
		_fields : null,
			
		_model : null,
		
		/**
		 * View object from the execution view controller
		 */
		_view : null,
		
		/**
		 * Parent Block
		 */
		_parent : null,
		
		/**
		 * state flags
		 */
		_isActive : false,
		_isFinished : false,
		
		/**
		 * Creates new exec component
		 * @param {cs.model.program.Component} a_model
		 * @param {cs.model.exec.Block} a_exec_parent
		 */
		constructor : function(a_model, a_exec_parent){
			this._model = a_model;
			this._parent = a_exec_parent;
			
			this._inputs = new cs.util.Container();
			this._outputs = new cs.util.Container();
			this._fields = new cs.util.Container();
			
			// create sockets in exec model
			this._model.getInputSockets().forEach(function(input){
				this._inputs.add(new cs.model.exec.InputSocket(input,this));
			},this);
			this._model.getOutputSockets().forEach(function(output){
				this._outputs.add(new cs.model.exec.OutputSocket(output,this));
			},this);
			this._model.getFieldSockets().forEach(function(field){
				this._fields.add(new cs.model.exec.FieldSocket(field,this));
			},this);
			
			if(this.hasView()){
				this._view = cs.executionViewController.addComponent(this._model);
			}
			
		},
		
		/**
		 * True if component is allowed to be run and is ready to be run
		 */
		isReadyToRun : function(){
			
			// as an optimist:
			var ready = true;
			
			// This component is not running yet and is not already finished!
			if(this.isActive() || this.isFinished()){
				ready = false;
			}
			console.log(this.getModel().getMetaData().getName(),"checked state: ready? ",ready);
			
			// is component in a block which is activated?
			// this.getParent() == null if this is root statement
			if(this.getParent()!==null && !this.getParent().isActive()){
				ready = false;
			}
			console.log(this.getModel().getMetaData().getName(),"checked parent block: ready? ",ready);
			
			// are all inputs set?
			this.getInputs().forEach(function(input){
					if(!input.hasValue()){
						ready = false;
					}
			});
			
			console.log(this.getModel().getMetaData().getName(),"checked inputs: ready? ",ready);
			
			// all blocks of which a wire goes out on the way to "this" have to be "isFinished"!
			if(ready){
				this.getInputs().forEach(function(input){
					input.getConnectedSockets().forEach(function(predecessorSocket){
						
						/**
						 * Only check if this input wire's value is used for evaluation
						 * This case only appears if two wires are from different IF/ELSE Block
						 */
						if(predecessorSocket.hasValue()){
						
							var predecessor = predecessorSocket.getOwner();
							
							if(predecessor.getParent() == this.getParent()){
								// all ok!
							} else {
								// we have to get the lowest-common-parent-block of the predecessor and this
								// on this all output blocks (all parent blocks of the predecessor to this lcp-block have to be "finished"
								
								// get all parent blocks of THIS
								var parentBlocksOfThisComponent = new cs.util.Container();
								var parentBlock = this.getParent();
								while(parentBlock !== null){
									parentBlocksOfThisComponent.add(parentBlock);
									parentBlock = parentBlock.getOwner().getParent();
								}
								
								// get all blocks which are between predecessor and LCP-block
								var parentBlocksOfPredecessorTillLCP = new cs.util.Container();
								parentBlock = predecessor.getParent();
								while(!parentBlocksOfThisComponent.has(parentBlock)){
									parentBlocksOfPredecessorTillLCP.add(parentBlock);
									parentBlock = parentBlock.getOwner().getParent();
								}
								
								// if one of this blocks is not yet finished... we are not ready
								parentBlocksOfPredecessorTillLCP.forEach(function(block){
									if(!block.isFinished()){
										ready = false;
									}
								},this);
							}
						}
						console.log("   ",this.getModel().getMetaData().getName(),ready);
					},this);
				},this);
			}			
			
			
			return ready;
		},
		
		run : function(){
			throw Error("owerride by subclass");
		},
		/*
		run : function(){
			
			// run component function
			console.log("RUN: ",this.getModel().getMetaData().getName());
			this.execute();
			
			
			 // check all successor components and run if ready to run!
			  
			 
			// avoid that a component executes a component several times because it is connected to it more than once
			var done = new cs.util.Container();
			this.getOutputs().forEach(function(output){
				output.getConnectedSockets().forEach(function(successorSockets){				
					if(successorSockets.getOwner().isReadyToRun() && !done.has(successorSockets.getOwner())){
						// execute component
						successorSockets.getOwner().run();
						// mark component as executed from this component
						done.add(successorSockets.getOwner());
					}
				},this);
			},this);
		},*/
		
		/**
		 * Execute the component, use exec-function from the metadata
		 */
		execute : function(){
			throw Error("Has to be overwritten by subclass : cs.model.exec.Component > execute");
		},
		
		/**
		 * Reset all values set by execution controller
		 */
		reset : function(){
			
			// reset state
			this.setIsActive(false);
			this.setIsFinished(false);
			
			// delete output values 
			this.getOutputs().forEach(function(output){
				output.setValue(null);
			});
		},
		
		/** 
		 * If component has a custom reset function, call it
		 */
		componentReset : function(){
			throw Error("Has to be overwritten by subclass");
		},
		
		
		setParent : function(a_exec_block){
			this._parent = a_exec_block;
		},
		
		getParent : function(){
			return this._parent;
		},
		
		getModel : function(){
			return this._model;
		},
		
		destroy : function(){
			this.getParent().removeComponent(this);
			if(this.hasView()){
				this.getView().destroy();
			}
		},
		
		/**
		 * Mark this as finished and all its successors
		 */
		forceFinished : function(){
			if(!this.isFinished()){
				this.setIsFinished(true);	
			
				this._outputs.forEach(function(outputSocket){
					outputSocket.getConnectedSockets().forEach(function(successorSocket){
						
						var toForce = true;
						// if the successor socket has no other connected wire
						// or all component also connected to the successor socket are finished
						// we force finish on this component too.
												
						if(successorSocket.getConnectedSockets().size()>1){
							successorSocket.getConnectedSockets().forEach(function(preOfSuccessorSocket){
								toForce = preOfSuccessorSocket.getOwner().isFinished() && toForce;
							},this);
						}
						
						if(toForce){
							successorSocket.getOwner().forceFinished();
						}
					},this);
				},this);
			}
		},
		
		setIsFinished : function(b){
			this._isFinished = b;
			if(b){
				this.setIsActive(false);
				
				// in case of this was last finished component from the parent block
				// this block has also to be set to 'finished'
				if(this.getParent()!==null){
					this.getParent().updateState();
				}
			}
		},
			
		isFinished : function(){return this._isFinished;},
		
		setIsActive : function(b){
			if(b && this.isFinished()){
				throw Exception("You try to set a component active but component already finished!");
			}
			this._isActive = b;
		},
		isActive   : function(){return this._isActive;},
		
		getInputs  : function(){return this._inputs;},
		getOutputs : function(){return this._outputs;},
		getFields  : function(){return this._fields;},
		getView    : function(){return this._view;},
		hasView    : function(){return this._model.getMetaData().hasView();}
	});
