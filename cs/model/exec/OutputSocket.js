/**
 * @author elcc
 * 
 * CS.MODEL.EXEC.OUTPUTSOCKET - This class represents a Socket on which we store the value on runtime.
 */
	dojo.provide("cs.model.exec.OutputSocket");
	
	dojo.require("cs.model.exec.Socket");
	
	dojo.declare("cs.model.exec.OutputSocket", cs.model.exec.Socket, {

		_value : null,
		
		/**
		 * Get value of output socket
		 */
		getValue : function(){
			if(this._model.isOutput()){
				return this._value;
			} else {
				throw Error("OutputSocket on non-Output Socket!");
			}
		},
		
		/**
		 * Sets the value of the output socket
		 * Not possible for input sockets
		 * @param {G} a_value
		 */
		setValue : function(a_value){
				this._value = a_value;
		}
	});
	

