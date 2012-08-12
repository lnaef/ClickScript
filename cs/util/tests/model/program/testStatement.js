/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.model.program.testStatement");
	
	
	dojo.require("cs.model.meta.MetaComponent");
	dojo.require("cs.model.program.Component");
	dojo.require("cs.model.program.Block");
	dojo.require("cs.model.program.Statement");
	
	doh.register("cs.util.tests.model.program.testStatement", [
		
		function statementConstructor(){
			
			
			var myMetaComponent = cs.library.getMetaComponent("cs.module.custom.test");
			var nbrOfInputTypes = myMetaComponent.getInputs().size();
			var nbrOfOutputTypes = myMetaComponent.getOutputs().size();
			var nbrOfFieldTyes = myMetaComponent.getFields().size();
			var InputTypes = myMetaComponent.getInputs();
			
			// test module number of generated sockets
			var myStatement = new cs.model.program.Statement(myMetaComponent);
			
			doh.is(myStatement.getInputSockets().size(),nbrOfInputTypes);
			doh.is(myStatement.getOutputSockets().size(),nbrOfOutputTypes);
			doh.is(myStatement.getFieldSockets().size(),nbrOfFieldTyes);
			
			// test against capturing
			var myStatement2 = new cs.model.program.Statement(myMetaComponent);
			doh.t(myStatement2.getInputSockets() != myStatement.getInputSockets());
			doh.t(myStatement2.getOutputSockets() != myStatement.getOutputSockets());
			doh.t(myStatement2.getFieldSockets() != myStatement.getFieldSockets());
			
			// check type of sockets
			var inputs = myStatement.getInputSockets();
			doh.is(inputs.get(0).getType(),InputTypes.get(0).getType());
		},
		
		function blockOfStatement(){
			var metadata = cs.library.getMetaComponent("cs.module.custom.test");
			var block = new cs.model.program.Block();
			var statement = new cs.model.program.Statement(metadata);
			doh.f(statement.hasParentBlock());
			statement.setParentBlock(block);
			doh.t(statement.hasParentBlock());
			
			var bodyBlock = new cs.model.program.Block();
			statement.addBlock(bodyBlock);
			doh.is(bodyBlock,statement.getBlock(0));
			doh.is(1,statement.getNbrOfBlock());
			doh.is(1,statement.getBlocks().size());
		}
	]);
