/**
 * @author elcc
 * 
 * CS.MODEL.PROGRAM.WIRE - This class represents a wire connectingt two components. It has of course
 * two links to two sockets the so called FROM-Socket and TO-Socket.
 */
	dojo.provide("cs.model.program.Wire");
	dojo.declare("cs.model.program.Wire", null, {
		
		_from : null,
		
		_to : null,
		
		/**
		 * Sets TO to a_socket
		 * @param {cs.model.program.Socket} a_socket
		 */
		connectTO : function(a_socket){
			
			// disconnect wire from socket if yet connected
			if(this._to){
				this._to.removeWire(this);
			}
			this._to = a_socket;
			this._to.addWire(this);
		},
		
		/**
		 * Sets FROM to a_socket
		 * @param {cs.model.program.Socket} a_socket
		 */
		connectFROM : function(a_socket){
			
			// disconnect wire from socket if yet connected
			if(this._from){
				this._from.removeWire(this);
			}
			this._from = a_socket;
			this._from.addWire(this);
		},
		
		/**
		 * Connects wire to a Socket and updates also the connection of the Socket
		 * If _from is not set socket will connected to _from otherwise to _to
		 * @param {cs.model.program.Socket} a_socket
		 */
		connect : function(a_socket){
			if(!this._from){
				this.connectFROM(a_socket);
			} else {
				this.connectTO(a_socket);
			}
		},
		
		
		disconnectFROM : function(){
			if(this._from){
				this._from.removeWire(this);
				this._from = null;
				return true;
			} else {
				return false;
			}
		},
		
		disconnectTO : function(){
			if(this._to){
				this._to.removeWire(this);
				this._to = null;
				return true;
			} else {
				return false;
			}
		},
		
		disconnect : function(){
			this.disconnectFROM();
			this.disconnectTO();
		},
		
		destroy : function(){
			var from = this.getFROM();
			var to = this.getTO();
			
			this.disconnect();
			// notify controller 
			// TODO: by event publish
			cs.modelController.onDeleteWire(this,from,to);			
		},
		
		isValidConnection : function(){
			return this._from.getType() == this._to.getType() && (this._from.getMode() != this._to.getMode());
		},
		
		/**
		 * Getters
		 */
		getTO : function(){return this._to;},
		getFROM : function(){return this._from;},
		
		
		/**
		 * TODO: Execution part in own model
		 * EXECUTION MODEL PART
		 */
		
		getExecValue: function(){
			if(this.getTO().isOutput()){
				return this.getTO().getExecValue();
			} else if(this.getFROM().isOutput()){
				return this.getFROM().getExecValue();
			} else {
				throw Error("NO PROPER WIREING");
			}
		}
	
	});
		
