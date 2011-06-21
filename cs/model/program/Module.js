/**
 * @author elcc
 * 
 * cs.model.program.Module - This class represents a Module Component with its inputs, outputs and fields
 * each module has also a link to a metadata object with its type specific information. 
 */
	
	dojo.provide("cs.model.program.Module");
	
	dojo.declare("cs.model.program.Module", cs.model.program.Component, {
		
	
		serialize : function(){

			// call serialize on superclass
			// @todo if only this, we can remove whole function
			return this.constructor.superclass.serialize.call(this); 
			
		}
	});