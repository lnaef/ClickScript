/**
 * @author elcc
 * 
 * cs.model.exec.Statement - This class represents ...
 */
	
	dojo.provide("cs.model.exec.Statement");
	
	dojo.require("cs.model.exec.Component");
	dojo.require("cs.model.exec.Block");
	
 	dojo.declare("cs.model.exec.Statement", cs.model.exec.Component, {
		
		_blocks : null,
		
		constructor : function(a_model){
			// initiation of component handled by cs.model.exec.Component
			this._blocks = new cs.util.Container();
			this.getModel().getBlocks().forEach(function(model_block){
				this.addBlock(new cs.model.exec.Block(model_block,this));
			},this);			
		},
		
		addBlock : function(a_block){
			this._blocks.add(a_block);
		},
		
		/**
		 * TODO: break in case of one false!
		 * 
		 */
		/*overwritten*/ isReadyToRun : function(){
			var ready = this.inherited(arguments);
			/*
			console.log("  statement has childs: ",this.getChildComponents(),"and is ready?",ready);
			var childComponents = this.getChildComponents();
			childComponents.forEach(function(child){
				child.getInputs().forEach(function(input){
					console.log("   check for", input);
					// if component connected to the input is ready > ok!
					if(!childComponents.has(input.getFrom()!=null && input.getFrom().getOwner())){
						console.log("  child is ready: ",input.getFrom().getOwner(),input.getFrom().getOwner().isReadyToRun());
						ready = ready && input.getFrom().getOwner().isReadyToRun();
					}
					// if input is not connected fine (input.getFrom() == null)
				},this);
			},this);*/
			return ready;
		},
		
		/**
		 * Execute statement with its current state
		 * Execute the function on this!
		 */
		/*overwritten*/ execute : function(){
				this.getModel().getMetaData().getExec().call(this,{
					inputs: this.getInputs(),
					outputs: this.getOutputs(),
					fields: this.getFields(),
					view: this.getView(),
					blocks: this.getBlocks()
				});
		},
		
		/**
		 * Reset all values set by execution controller
		 */
		/*overwritten*/ reset : function(){
			this.inherited(arguments);
			
			this.getBlocks().forEach(function(block){
				block.reset();
			});
		},
		
		/** 
		 * If component has a custom reset function, call it
		 */
		/*overwritten*/ componentReset : function(){
			// custom reset if available in meta data
			if(this.getModel().getMetaData().getReset()){
				this.getModel().getMetaData().getReset().call(this,{
					inputs: this.getInputs(),
					outputs: this.getOutputs(),
					fields: this.getFields(),
					view: this.getView(),
					blocks: this.getBlocks()
				});
			}	
			
			this.getBlocks().forEach(function(block){
				block.componentReset();
			});
		},
		
		
		/*overwritten*/ run : function(){
			this.setIsActive(true);
 
			try {
				this.execute();
			} catch(e){
				var msg = "Execute Statement Error in statement: "+this.getModel().getMetaData().getName() + "<br/>&nbsp;&nbsp;&nbsp;&nbsp;";
				cs.console.writeError(msg + e);
				cs.executionController.getWorklist().error();
			}
		},
		
		updateState : function(){
			var finished = true;
			this.getBlocks().forEach(function(block){
				if(!block.isFinished()){
					finished = false;
				}
			});
			if(finished){
				this.setIsFinished(true);
			}
		},
		
		getBlocks : function(){return this._blocks;},
		
		/**
		 * Returns a container filled with all transitively child components
		 * including the components of this.components component ;-)
		 */
		getChildComponents : function(){
			result = new cs.util.Container();
			this.getBlocks().forEach(function(block){
				block.getComponents().forEach(function(component){
					result.add(component);
					if (component.getModel().isStatement()) {
						component.getChildComponents().forEach(function(childComponent){
							result.add(child);
						}, this);
					}
				},this);
			},this);
			return result;
		}
	});
