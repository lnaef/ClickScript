/**
 * @author elcc
 * 
 * CS.TYPE.TYPE - This class represents a ClickScript-TypeStructure. Needed for the class cs.type.Type
 * as the structural component of a type. The structure always has a type name. The type may consist of a few attributes e.g.
 *    cs.type.custom.Letter:
 *      - name : "cs.type.String"
 *      - prename : "cs.type.String"
 *      - plz : "cs.type.Number"
 *      
 */
	dojo.provide("cs.type.Structure");
	//statically loaded dojo.require("cs.type.Controller");	

	dojo.declare("cs.type.Structure", null, {

		/**
		 * Container for the attributes of the type
		 */
		_attributes : null,
		
		/**
		 * unique name of this typestructure
		 */
		_name : null,
		
		/**
		 * color of the type
		 */
		_color : null,
		
		constructor : function(a_name,a_color){
			this._attributes = [];
			this._name = a_name;
			this._color = (a_color) ? a_color : "#ccc";
		},
		
		/**
		 * Adds (a_name, a_type) tuple to the substructure
		 * @param {String} a_name
		 * @param {cs.type.Type} a_type_name
		 */
		addAttribute : function(a_name,a_type){
			this._attributes[a_name] = a_type;
		},
		
		/**
		 * Returns the typeStructure as String
		 */
		toString : function(){
			var output = this._name + ((this._attributes.length>0)?"{":"");
			for(var item in this._attributes){
				output = output +" " +item + ":" + this._attributes[item]+",";
			};
			return output + ((this._attributes.length>0)?"}":"");
		},
		
		/**
		 * Return the name of the type
		 */
		
		getAttributes : function(){
			return this._attributes;
		},
		
		getName : function(){
			 return this._name;
		},
		
		getColor : function(){
			return this._color;
		},
		
		getSize: function(){
			var i = 0;
			for(x in this._attributes){i++;}
			return i;
		},
		
		getAttribute: function(a_name){
			return this._attributes[a_name];
		}
		
	});
		