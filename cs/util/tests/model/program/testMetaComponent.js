/**
 * @author lnaef
 */

dojo.provide("cs.util.tests.model.program.testMetaComponent");

dojo.require("cs.model.meta.MetaComponent");

doh.register("cs.util.tests.model.program.testMetaComponent", [

	function metaComponentConstructor(){
		
		var stringType = new cs.type.Type("string");
		
		var name = "test.meta.module";
		var description = "This is a string concatenation module. Concats two input strings. Inserts, if available, the value from the privat input field between the two fields";
		
		var imgPath = "ghi.gif";
		
		var inputTypes = [stringType,stringType];
		var outputTypes = [stringType];
		var fieldTypes = [stringType];
		
		var myMetaComponent = new cs.model.meta.MetaComponent(
		{
		name: name,
		description: description,
		inputs: inputTypes,
		outputs: outputTypes,
		fields: fieldTypes,
		image: imgPath,
		blocks: []
	});
		
		doh.is(myMetaComponent.getName(),name);
		doh.is(myMetaComponent.getDescription(),description); 
		doh.is(myMetaComponent.getInputs().get(0).getType(),inputTypes[0]);
		doh.is(myMetaComponent.getOutputs().get(0).getType(),outputTypes[0]);
		doh.is(myMetaComponent.getFields().get(0).getType(),fieldTypes[0]);
		doh.is(myMetaComponent.getImgPath(),imgPath);
		
		var myMetaComponent2 = new cs.model.meta.MetaComponent(
		{
			name: name,
			description: description,
			inputs: inputTypes,
			outputs: outputTypes,
			fields: fieldTypes,
			image: imgPath,
			blocks: []
		});		
		doh.f(myMetaComponent2.getInputs() == myMetaComponent.getInputs());
	},
	
	function testComplexSocketStructure(){
		var stringType = new cs.type.Type("string");
		
		var name = "test.meta.module";
		var description = "This is a string concatenation module. Concats two input strings. Inserts, if available, the value from the privat input field between the two fields";
		
		var imgPath = "ghi.gif";
		
		var inputTypes = [{
			name: "text1",
			type: stringType
		},stringType];
		var outputTypes = [stringType];
		var fieldTypes = [stringType];
		
		var myMetaComponent = new cs.model.meta.MetaComponent({		
			name: name,
			description: description,
			inputs: inputTypes,
			outputs: outputTypes,
			fields: fieldTypes,
			image: imgPath,
			blocks: []
		});	
		
		doh.is("text1",myMetaComponent.getInputs().get(0).getName());
		doh.is("",myMetaComponent.getInputs().get(1).getName());
	},
	
	function metaComponentConstructorEmpty(){
		doh.assertException(function(){new cs.model.meta.MetaComponent();});
	}

	
]);



