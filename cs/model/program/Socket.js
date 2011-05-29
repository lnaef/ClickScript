/**
 * @author elcc
 * 
 * CS.MODEL.PRORGRAM.SOCKET - This class represents a Socket of a Module. The socket has a position
 * indication on which position it is placed regarding the mode. The mode can be InputSocket, OutputSocket
 * FieldSocket... the connection to the component is given by the component attribute.
 */
	dojo.provide("cs.model.program.Socket");
	
	dojo.require("cs.util.Container");
	
	dojo.declare("cs.model.program.Socket", null, {
		
		/**
		 * all connected wires to this Socket
		 * @type : cs.util.Container
		 */
		_wires : null,
		
		/**
		 * meta data about this socket, name, type, mode, position...
		 * @type : cs.model.meta.MetaSocket
		 */
		_metadata : null,
		
		/**
		 * compontent which contains this socket
		 * needed for validation of graph structure
		 * @type : cs.model.program.component
		 */
		_component : null,
		
		/**
		 * Creates a cs.model.program.Socket
		 * @param {cs.model.meta.Socket}       a_metaSocket  metadata about this socket
		 * @param {cs.model.program.Component} a_component   parent component
		 */
		constructor : function(a_metaSocket, a_component){
			this._uid = cs.global.serializer.getUid();
			this._wires = new cs.util.Container();
			this._metadata = a_metaSocket;
			this._component = a_component;
		},
		
		_uid : null,
		
		/**
		 * Returns true if a_wire successfully added to socket
		 * @param {cs.model.program.Wire} a_wire
		 */
		addWire : function (a_wire){
			if (!this.hasWire(a_wire)) {
				this._wires.add(a_wire);
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Returns true if a_wire is in the wire-container
		 * @param {cs.model.program.Wire} a_wire
		 */
		hasWire : function (a_wire){
			return this._wires.has(a_wire);
		},
		
		/**
		 * Handle forEach on each Wire
		 * @param {Object} a_callback
		 * @param {Object} /optional/a_thisObject
		 */
		forEachWire : function(a_callback, /*optional*/ a_thisObject){
			this._wires.forEach(a_callback, a_thisObject);
		},
		
		
		/**
		 * Returns true if a_wire successfully removed from the socket
		 * @param {cs.model.program.Wire} a_wire
		 */
		removeWire : function (a_wire){
			return this._wires.remove(a_wire);
		},
		
		isInput : function(){
			return this._metadata.isInput();
		},
		
		isOutput : function(){
			return this._metadata.isOutput();
		},
		
		isField : function(){
			return this._metadata.isField();
		},
		
		serialize : function(){
			return cs.global.serializer.serialize('socket',{'uid':this.getUid()});
		},
		
		/**
		 * Getters
		 */
		getPosition : function(){ return this._metadata._position;},
		getType : function(){ return this._metadata._type;},
		getMode : function(){ return this._metadata._mode;},
		getName : function(){ return this._metadata._name;},
		getMetaData : function(){ return this._metadata;},
		getUid : function(){ return this._uid;},
		getComponent : function(){ return this._component;}

		/**
		 * TODO: move this to execution model only
		 * EXECUTION MODEL STUFF
		 */
		
		/* MOVED!
		_execValue : null,
		
		getExecValue : function(){
			if(this.isInput()){
				if(this._wires.size() == 1){
					return this._wires.item(0).getExecValue();
				} else if(this._wires.size() == 0){
					return null;
				} else {
					throw Error("More than one wire connected to Input-Socket!");
				}
			} else if(this.isOutput()){
				return this._execValue;
			} else if(this.isField()){//should be set by the exec of the primitive to the output? so remove it?
				return this.getValue();
			}
		},
		setExecValue : function(a_value){
			if(this.isOutput()){
				this._execValue = a_value;
			}
		}*/
				
	});
	
		/**
		 * Static variables describing the mode of the Socket
		 */
	cs.model.meta.MetaSocket.MODE_UNDEFINED = 0;
	cs.model.meta.MetaSocket.MODE_INPUT = 1;
	cs.model.meta.MetaSocket.MODE_OUTPUT = 2;
	cs.model.meta.MetaSocket.MODE_INPUT_FIELD = 3;
	
