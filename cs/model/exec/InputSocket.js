/**
 * @author elcc
 * 
 * CS.MODEL.EXEC.SOCKET - This class represents a Socket 
 */
	dojo.provide("cs.model.exec.InputSocket");
	
	dojo.require("cs.model.exec.Socket");
	
	dojo.declare("cs.model.exec.InputSocket", cs.model.exec.Socket, {

		/**
		 * Get value from the connected outputsocket
		 * It is not possible to have several connected sockets
		 */
		getValue : function(){
			if(this._model.isInput()){
				if(this._connectedSockets.size() == 1){
					return this._connectedSockets.item(0).getValue();
				} else if(this._connectedSockets.size() == 0){
					return null;
				} else {
					/**
					 * More than one connected wire to one Input Socket
					 * For the case of IF/ELSE blocks allowed!
					 */
					var result = null;
					this._connectedSockets.forEach(function(socket){
						if(socket.getValue()!== null){
							result = socket.getValue();
						}
					});
					return result;
					//throw Error("More than one wire connected to Input-Socket!");
				}
			} else {
				throw Error("InputSocket on non-Input Socket!");
			}
		},
		
		getFrom : function(){
			var result = null;
			if (this._connectedSockets.size() == 1) {
				result = this._connectedSockets.item(0);
			} 
			return result;
		}
				
	});
	

