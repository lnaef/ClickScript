/**
 * @author elcc
 * 
 * @todo: modules now have an id, we can put them in a map on the id to be faster in catching them
 * 
 */
	
	dojo.provide("cs.controller.Worklist");
	
	dojo.require("cs.util.Container");
	dojo.require("dojo.string");
	
 	dojo.declare("cs.controller.Worklist", null, {
		
 		/**
 		 * List with the items next to run
 		 * Successor of already finished components
 		 */
 		_worklist : null,
 		
 		_startStatement : null,
 		
 		_isRepeatedRun : false,
 		_isStop : false,
 		
 		_runCounter : 0,
 		
 		_isDebug : false,
 		
 		/** 
 		 * Components to add first get into this container
 		 */
 		_toAdd : null,
 		
 		
 		constructor : function(a_startStatement){
 			this._startStatement = a_startStatement;
 			this._worklist = new cs.util.Container();
 			this._toAdd = new cs.util.Container();
 		},
 	
 		run : function(){
 			
 			// reset isFinished and isActive flags
 			this._startStatement.reset();
		
 			
 			this.add(this._startStatement);
 			this.log("RUN WORKLIST:");
 			
 			this._runCounter ++;
 			this.onNewRun();
 			this.runOnce();
 		},
 		/**
 		 * Go through the worklist and execute all items which are ready
 		 */
 		runOnce : function(){
 			this.changeState("RUN");
 			var runAgain = false;
 			var toRemove = new cs.util.Container();
 			
 			this.log("RUN ONCE WORKLIST");
 			
 			this._worklist.forEach(function(component){
 				if(!this.isStop()){
	 				this.log("  CHECK COMPONENT: '", component.getModel().getMetaData().getName(),"'  (FINISHED?: ",(component.isFinished())?"<b style=\"color:red\">true</b>":"false"," WL-SIZE: ",this.size()-toRemove.size())+")";
	 				
	 				// is component in the worklist ready to run?
	 				if(component.isReadyToRun()){
	 					
	 					this.log("      COMPONENT IS READY! > RUN COMPONENT <b style=\"color:red\">'" + component.getModel().getMetaData().getName()+"'</b>");
	 					
	 					component.getFields().forEach(function(fields){
	 						this.log("         FIELD  '" + fields.getValue()+"'");
	 					},this);
	 					component.getInputs().forEach(function(input){
	 						this.log("         INPUT  '" + input.getValue()+"'");
	 					},this);
	 					
	 					// if the component is ready to run... doit!
	 					component.run();
	
	 					component.getOutputs().forEach(function(output){
	 						this.log("         OUTPUT '" + output.getValue()+"'");
	 					},this);
	 					
	 					
	 					runAgain = true;
	 				}
	 				
	 				// is component in the worklist already finished?
	 				if(component.isFinished()){
	 					
	 					// add all successors to the worklist
	 					component.getOutputs().forEach(function(output){
	 						output.getConnectedSockets().forEach(function(successorSockets){
	 							var successor = successorSockets.getOwner();
	 							this.add(successor);
	 						},this);
	 					},this);
	 					
	 					// remove finished component from workinglist
	 					toRemove.add(component);
	 					this.log("      COMPONENT REMOVED : WL-SIZE: ", this.size()-toRemove.size());
	 				
	 					runAgain = true;
	 				}
 				}
 			},this);
 			
 			// we can't remove the components directly in the loop above
 			// because we are iterating through the container and it gives
 			// trouble with cursor of container in case we remove an item
 			toRemove.forEach(function(component){
 				this._worklist.remove(component);
 				runAgain = true;
 			},this);
 			
 			// after we removed stuff to remove, we now can add new components.
 			this._toAdd.forEach(function(component){
 				this._worklist.add(component);
 				runAgain = true;
 			},this);
 			this._toAdd = new cs.util.Container();
 			
 			if(!this.isStop()){
	 			if(this.size() == 0){
	 				//worklist is empty
	 				this.log("SUCCESSFULLY FINISHED EXECUTION OF WORKLIST!");
	 				if(this.isRepeatedRun()){
	 					this.log("REPEATED RUN is ON");
	 					setTimeout(function(){cs.executionController.getWorklist().run();},1000);
	 				} else {
	 					this.changeState("FINISH");
	 				}
	 			} else {
	 				if(runAgain){
	 					this.runOnce();
	 				} else {
	 					this.changeState("WAIT");
	 					// may be there is an asynchronious module?
	 					this.log("WAITING...");
	 				}
	 			}
 			} else {
 				this.changeState("STOP");
 				this.log("USER STOPPED EXECUTION");
 			}
 		},
 		
 		/**
 		 * Reseting the worklist
 		 */
 		reset : function(){
 			
 			this._startStatement.componentReset();
 			
 			//publish event that everyone can connect like utils of libraries
 			dojo.publish("worklist/reset");
 			
 			this._worklist = new cs.util.Container();
 			this._isStop = false;
 			//this.setRepeatedRun(false);
 			this._runCounter = 0;
 			this.logNbr = 0;
 		},
 		
 		
 		stop : function(){
 			this._isStop = true;
 		},
 		
 		error : function(){
 			this.stop();
 		},
 		
 		isStop : function(){
 			return this._isStop;
 		},
 		
 		setRepeatedRun : function(b){
 			this._isRepeatedRun = b;
 		},
 		
 		getRepeatedRun : function(){
 			return this._isRepeatedRun;
 		},
 		
 		isRepeatedRun : function(){
 			return this._isRepeatedRun;
 		},

 		onNewRun : function(){
 			// to connect events
 			// like getting the current runnumber
 		},
 		
 		changeState : function(a_state){
 			this.onStateChange(a_state);
 		},
 		/**
 		 * to connect events
 		 * a_state may be: "RUN" "WAIT" "FINISH" "STOP"
 		 */
 		onStateChange : function(a_state){
 			
 		},
 		
 		getRunCounter : function(){return this._runCounter;},
 		
 		/**
 		 * adds a component to the the worklist
 		 * @param cs.model.exec.Component execComponent  
 		 */
 		add : function(execComponent){
 			    this.log("  ADD COMPONENT: ", execComponent.getModel().getMetaData().getName());
				this._toAdd.add(execComponent);
 			    /*
 			    if(!this._worklist.has(execComponent)){
						this._worklist.add(execComponent);
				} else {
					console.log("???", " already in worklist:", execComponent.getModel().getMetaData().getName());
				}*/
 		},

 		
 		/**
 		 * returns the size of the workinglist
 		 * 0 if workinglist is empty
 		 */
 		size : function(){
 			return this._worklist.size();
 		},
 		
 		pause : function(millis){
 			var date = new Date();
 			var curDate = null;

 			do { curDate = new Date(); }
 			while(curDate-date < millis); 
 		},
 		
 		/**
 		 * Log messages
 		 * @param String message 
 		 */
 		log : function(message){
 			if(this.isDebug()){
	 			var out = "";
	 			for(var i=0;i<arguments.length;i++){
	 				out += arguments[i];
	 			}
	 			out = dojo.string.rep(" ",Math.abs(4-(this.logNbr + "").length)) + this.logNbr + " " + out;
 			
 				cs.executionController.write(out);
 				this.logNbr ++;
 			}
 		},
 		
 		logNbr : 0,
 		
 		isDebug : function(){
 			return this._isDebug;
 		},
 		
 		setIsDebug : function(b){
 			this._isDebug = b;
 		}
	});