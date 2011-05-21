/**
 * @author elcc
 * 
 * CS.MODEL.meta.MetaBlock - This class represents the metadata about a block. 
 * 
 * 
 */
	dojo.provide("cs.model.meta.MetaBlock");

	dojo.require("cs.util.Container");

	dojo.declare("cs.model.meta.MetaBlock", null, {
		
		_name : null,
		
		constructor : function(a_data){
			if (a_data.name) {
				this._name = a_data.name;
			} else {
				throw Error("metablock needs at least a name!");
			}
		},
		
		/**
		 * Getters
		 */
		getName : function(){return this._name;}
	});