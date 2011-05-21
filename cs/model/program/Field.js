/**
 * @author elcc
 */
/**
 * @author elcc
 * 
 * CS.MODEL.PRORGRAM.FIELD- This class represents a Field of a Module, like field Sockets.
 * It is quiet the same like a socket but also has its own value.
 */
	dojo.provide("cs.model.program.Field");
	
	dojo.require("cs.model.program.Socket");
	
	dojo.declare("cs.model.program.Field", cs.model.program.Socket, {
		
		_value : null,

		constructor: function(a_metaSocket,a_component,a_value){
			//init of a_metaSocket and a_component done by superclass cs.model.program.Socket
			if(a_metaSocket.getMode() != cs.model.meta.MetaSocket.MODE_INPUT_FIELD){
				throw Error("mode has to be cs.model.meta.MetaSocket.MODE_INPUT_FIELD");
			}
			this.setValue(a_value ? a_value : "");
		},
		
		setValue : function(a_value){
			this._value = a_value;
		},
		
		getValue : function(){
			return this._value;
		},
		
		serialize : function(){
			return cs.serializer.createElement('<socket id="'+this.getId()+'" value="'+(this.getValue()?this.getValue():"")+'" />');
		}
		
	});
