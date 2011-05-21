/**
 * @author elcc
 * 
 * CS.MODEL.meta.MetaSocket - This class represents the metadata about a socket. 
 * 
 * 
 */
	dojo.provide("cs.model.meta.MetaSocket");

	dojo.require("cs.util.Container");

	dojo.declare("cs.model.meta.MetaSocket", null, {
		
		_name : null,
		
		_type : null,
		
		_mode : null,
		
		_position : null,
		
		constructor : function(a_name, a_type, a_mode, a_position){
			this._name = a_name;
			this._type = a_type;
			this._mode = a_mode;
			this._position = a_position;
		},
		
		/**
		 * Mode checkers
		 */
		isInput        : function(){ return this._mode == cs.model.meta.MetaSocket.MODE_INPUT;},
		isOutput       : function(){ return this._mode == cs.model.meta.MetaSocket.MODE_OUTPUT;},
		isField : function(){ return this._mode == cs.model.meta.MetaSocket.MODE_INPUT_FIELD;},	
			
		/**
		 * Getters
		 */
		getName : function(){return this._name;},
		getType : function(){return this._type;},
		getMode : function(){return this._mode;},
		getPosition : function(){return this._position;}

	});
	
	cs.model.meta.MetaSocket.MODE_UNDEFINED = 0;
	cs.model.meta.MetaSocket.MODE_INPUT = 1;
	cs.model.meta.MetaSocket.MODE_OUTPUT = 2;
	cs.model.meta.MetaSocket.MODE_INPUT_FIELD = 3;