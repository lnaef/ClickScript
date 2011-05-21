dojo.provide("cs.lib.converter.init");

// add test module
csComponentContainer.push({
	name : "cs.converter.num2str",
	description : "TEXT is the converted NUMBER to text",
	inputs : [
		{
			name: "NUMBER",
			type: cs.library.getType("cs.type.Number")
		}],
	outputs:  [{
			name: "TEXT",
			type: cs.library.getType("cs.type.String")
			}],
	image : "converter/Num2Str.png",
	exec: function(state){
		var number = state.inputs.item(0).getValue();
		state.outputs.item(0).setValue(number+"");
	}
});


csComponentContainer.push({
	name : "cs.converter.str2num",
	description : "This module converts the TEXT to a number NUMBER. If input is not a number, output will be -1",
	inputs : [
		{
			name: "TEXT",
			type: cs.library.getType("cs.type.String")
		}],
	outputs:  [{
			name: "NUMBER",
			type: cs.library.getType("cs.type.Number")
			}],
	image : "converter/Str2Num.png",
	exec: function(state){
		var text = state.inputs.item(0).getValue();
		var result = -1;
		if(text.match(/^[0-9]*(\.[0-9]*)?$/)){
			result = parseFloat(text);
		}
		state.outputs.item(0).setValue(result);
	}
});
