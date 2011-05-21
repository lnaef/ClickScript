/**
 * @author elcc
 * 
 * CS.MODEL.EXEC.OUTPUTSOCKET - This class represents a Socket on which we store the value on runtime.
 * 
 * TODO: REDESIGN OF field > RENAME TO FIELD AND REMOVE FROM SOCKETDESIGN AT ALL!
 */
	dojo.provide("cs.model.exec.FieldSocket");
	
	dojo.require("cs.model.exec.Socket");
	
	dojo.declare("cs.model.exec.FieldSocket", null, {

		_model : null,

		constructor : function (a_model){
			this._model = a_model;
		},
		
		getModel : function(){
			return this._model;
		},
		/**
		 * Get value of field socket
		 */
		getValue : function(){
			return this.getModel().getValue();
		}
	});
	

