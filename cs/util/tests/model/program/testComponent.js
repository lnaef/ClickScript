/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.model.program.testComponent");
	
	
	dojo.require("cs.model.meta.MetaComponent");
	dojo.require("cs.model.program.Component");
	dojo.require("cs.model.program.Block");
	
	doh.register("cs.util.tests.model.program.testComponent", [
		
		function moduleConstructor(){
			
			
			var myMetaComponent = cs.library.getMetaComponent("cs.module.custom.test");
			var nbrOfInputTypes = myMetaComponent.getInputs().size();
			var nbrOfOutputTypes = myMetaComponent.getOutputs().size();
			var nbrOfFieldTyes = myMetaComponent.getFields().size();
			var InputTypes = myMetaComponent.getInputs();
			
			// test module number of generated sockets
			var myModule = new cs.model.program.Component(myMetaComponent);
			
			doh.is(myModule.getInputSockets().size(),nbrOfInputTypes);
			doh.is(myModule.getOutputSockets().size(),nbrOfOutputTypes);
			doh.is(myModule.getFieldSockets().size(),nbrOfFieldTyes);
			
			// test against capturing
			var myModule2 = new cs.model.program.Component(myMetaComponent);
			doh.t(myModule2.getInputSockets() != myModule.getInputSockets());
			doh.t(myModule2.getOutputSockets() != myModule.getOutputSockets());
			doh.t(myModule2.getFieldSockets() != myModule.getFieldSockets());
			
			// check type of sockets
			var inputs = myModule.getInputSockets();
			doh.is(inputs.get(0).getType(),InputTypes.get(0).getType());
		},
		
		function blockConstructor(){
			var metadata = cs.library.getMetaComponent("cs.module.custom.test");
			var block = new cs.model.program.Block();
			var module = new cs.model.program.Component(metadata);
			doh.f(module.hasParentBlock());
			module.setParentBlock(block);
			doh.t(module.hasParentBlock());
		}
	]);
