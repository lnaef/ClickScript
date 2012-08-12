/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.model.exec.testComponent");
	
	dojo.require("cs.model.program.Component");
	dojo.require("cs.model.exec.Component");
	
	doh.register("cs.util.tests.model.exec.testComponent", [
		
		function moduleConstructor(){
			
			
			var myMetaComponent = cs.library.getMetaComponent("cs.module.custom.test");
			console.log(myMetaComponent);
			var myComponent     = new cs.model.program.Component(myMetaComponent);
			var myExecComponent = new cs.model.exec.Component(myComponent);
			
			doh.is(myExecComponent.getModel(),myComponent);
			doh.t(myComponent.getInputSockets().size()>0);
			doh.is(myComponent.getInputSockets().size(),myExecComponent.getInputs().size());
			doh.is(myComponent.getOutputSockets().size(),myExecComponent.getOutputs().size());
			
		}
	]);
