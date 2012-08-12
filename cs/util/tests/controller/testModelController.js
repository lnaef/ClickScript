/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.controller.testModelController");

	dojo.require("cs.controller.ModelController");
	dojo.require("cs.util.tests.controller.testLibraryController");
	
	doh.register("cs.util.tests.controller.testModelController", [
		
		function constructorModelController(){
			new cs.controller.ModelController();
		},
		
		function addComponent(){
			var controller = new cs.controller.ModelController();
			controller.addComponent("cs.module.string.concat",{x:200,y:100});
			
			var module = controller._rootStatement.getBlock(0).getComponentContainer().get(0);			
			doh.is("cs.module.string.concat",module.getMetaData().getName());
		},
		
		function moveComponentToBlock(){
			//init
			var controller = new cs.controller.ModelController();
			var fromBlock = new cs.model.program.Block();
			var toBlock = new cs.model.program.Block();
			
			//prepare
			var module = cs.library.getNewModule("cs.module.string.concat");
			fromBlock.addComponent(module);
			doh.t(fromBlock.hasComponent(module));
			
			//move module from FROMBlock to TOBlock
			controller.moveComponentToBlock(module,toBlock);
			doh.f(fromBlock.hasComponent(module));
			doh.t(toBlock.hasComponent(module));			
		},
		
		function connectSockets(){
			var controller = new cs.controller.ModelController();
			var module1 = cs.library.getNewModule("cs.module.string.concat");
			var module2 = cs.library.getNewModule("cs.module.string.concat");
			
			var s1 = module1.getOutputSockets().get(0);
			var s2 = module2.getInputSockets().get(0);
			var wire = controller.connectSockets(s1,s2);
			doh.t(wire.getFROM(),s1);
			doh.t(wire.getTO(),s2);
			doh.t(s1.hasWire(wire));
			doh.t(s2.hasWire(wire));
		},
		
		function deleteComponent(){
			var controller = new cs.controller.ModelController();
			var module1 = cs.library.getNewModule("cs.module.string.concat");
			var module2 = cs.library.getNewModule("cs.module.string.concat");
			var block = new cs.model.program.Block();

			// add both modules to the block
			block.addComponent(module1);
			block.addComponent(module2);
			doh.t(block.hasComponent(module1));
			doh.t(block.hasComponent(module2));
						
			// connect the two modules through a wire
			var s1 = module1.getOutputSockets().get(0);
			var s2 = module2.getInputSockets().get(0);
			var wire = controller.connectSockets(s1,s2);
			doh.t(wire.getFROM(),s1);
			doh.t(wire.getTO(),s2);
			
			// delete module1 and all its connected wires
			controller.deleteComponent(module1);
			doh.f(block.hasComponent(module1));
			doh.t(block.hasComponent(module2));	
			doh.f(wire.getFROM(),s1);
			doh.f(wire.getTO(),s2);		
		},
		
		function updatePosition(){
			var controller = new cs.controller.ModelController();
			var module = cs.library.getNewModule("cs.module.string.concat");
			doh.is(0,module.getPositionProg().x);
			doh.is(0,module.getPositionExec().x);
			
			controller.updatePositionProg(module,100,200);
			controller.updatePositionExec(module,300,400);
			
			doh.is(100,module.getPositionProg().x);
			doh.is(200,module.getPositionProg().y);
			doh.is(300,module.getPositionExec().x);
			doh.is(400,module.getPositionExec().y);
		}
	]);
