/**
 * ClickScript - ClickScript is a visual programming language. This is a 
 * data flow programming language running entirely in a web browser.
 * Copyright (C) 2012 Lukas Naef
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * @author lnaef
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
