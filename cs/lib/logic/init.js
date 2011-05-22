/**
 * @author elcc
 */

dojo.provide("cs.lib.logic.init");

	cs.componentContainer.push({
		name : "cs.logic.random",
		description : "This module generates a randoized true and false values ",
		inputs : 
			[],
		outputs:  
			[{
				name: "RANDOM",
				type: "cs.type.Boolean"
			}],
		image: "logic/random.png",
		exec : function(state){
			var rand = Math.random() > 0.5;
			state.outputs.item(0).setValue(rand);
		}
	});


	cs.componentContainer.push({
		name : "cs.logic.and",
		description : "True if BOOLEAN1 and BOOLEAN2 both are true",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			},
			{
				name: "BOOLEAN2",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/and.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			var boolean2 = state.inputs.item(1).getValue();
			state.outputs.item(0).setValue(boolean1 && boolean2);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.logic.or",
		description : "True if BOOLEAN1 or BOOLEAN2 or both of them are true",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			},
			{
				name: "BOOLEAN2",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/or.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			var boolean2 = state.inputs.item(1).getValue();
			state.outputs.item(0).setValue(boolean1 || boolean2);
		}
	});
	
	cs.componentContainer.push({
		name : "cs.logic.xor",
		description : "True if exact one of the two inputs are true",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			},
			{
				name: "BOOLEAN2",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/xor.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			var boolean2 = state.inputs.item(1).getValue();
			state.outputs.item(0).setValue((boolean1&&!boolean2) || (boolean2&&!boolean1));
		}
	});
	
	cs.componentContainer.push({
		name : "cs.logic.not",
		description : "The opposit of BOOLEAN1",
		inputs : 
			[{
				name: "BOOLEAN1",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[{
				name: "RESULT",
				type: "cs.type.Boolean"
			}],
		image: "logic/not.png",
		exec : function(state){
			var boolean1 = state.inputs.item(0).getValue();
			state.outputs.item(0).setValue(!boolean1);
		}
	});
	
	