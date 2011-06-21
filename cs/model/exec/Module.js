/**
 * @author elcc
 * 
 * cs.model.exec.Statement - This class represents ...
 */
	
	dojo.provide("cs.model.exec.Module");
	
	dojo.require("cs.model.exec.Component");
	
	dojo.declare("cs.model.exec.Module", cs.model.exec.Component, {
		/**
		 * Execute module with its current state
		 * Execute the function on this!
		 */
		/*overwritten*/ execute : function(){
				this.getModel().getMetaData().getExec().call(this,{
					inputs: this.getInputs(),
					outputs: this.getOutputs(),
					fields: this.getFields(),
					view: this.getView()
				});			
		},
		
		/*overwritten*/ run : function(){
			this.setIsActive(true);
			try {
			this.execute();
			} catch(e){
				var msg = "Execute Module Error in module: "+this.getModel().getMetaData().getName() + "<br/>&nbsp;&nbsp;&nbsp;&nbsp;";
				cs.console.writeError(msg + e);
				cs.executionController.getWorklist().error();
			}
			if(!this.isAsync()){
				this.setIsFinished(true);
			}
			
		},
		
		/*overwritten*/ componentReset : function(){
			// custom reset if available in meta data
			if(this.getModel().getMetaData().getReset()){
				this.getModel().getMetaData().getReset().call(this,{
					inputs: this.getInputs(),
					outputs: this.getOutputs(),
					fields: this.getFields(),
					view: this.getView()
				});
			}	
			
		},
		

		/**
		 * True if after execution of module we wait on a async 'forceFinish'
		 */
		_isAsync : false,
		
		/**
		 * Set this module asynchronious
		 */
		setAsync : function(){
			this._isAsync = true;
		},
		
		isAsync : function(){
			return this._isAsync;
		},
		
		finishAsync : function(){
			console.log("Ansync finish");
			if(!this.isFinished()){
				this.setIsFinished(true);
				// do one trial more
				cs.executionController.getWorklist().runOnce();
			} else {
				throw Error("Trial to execute a module twice!");
			}
		}
	});
