/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.model.program.testSocket");
	
	dojo.require("cs.model.program.Wire");
	dojo.require("cs.model.program.Socket");
	
	doh.register("cs.util.tests.model.program.testSocket", [
		
		function socketConstructor(){
			var module = cs.library.getNewModule("cs.module.custom.test");
			var socket = new cs.model.program.Socket(module.getMetaData().getInputs().get(0),module);

			doh.t(socket.isInput());
			doh.f(socket.isOutput());
			doh.t(socket.getComponent(),module);
			doh.is(socket.getPosition(),0);
			
			//private access, avoid on programming
		},
		
		function socketAddWire(){
			var module = cs.library.getNewModule("cs.module.custom.test");
			var socket = module.getInputSocket(0);
			var wire1 = new cs.model.program.Wire();
			var wire2 = new cs.model.program.Wire();
			doh.is(0,socket._wires.size());
			
			doh.f(socket.hasWire(wire1));
			doh.t(socket.addWire(wire1));
			doh.t(socket.hasWire(wire1));
			
			// wire already connected
			doh.f(socket.addWire(wire1));
			
			// add another wire
			doh.t(socket.addWire(wire2));
			doh.t(socket.hasWire(wire2));
			
			doh.is(2,socket._wires.size());
		},
		
		function socketRemoveWire(){
			var module = cs.library.getNewModule("cs.module.custom.test");
			var socket = module.getInputSocket(0);
			var wire1 = new cs.model.program.Wire();
			var wire2 = new cs.model.program.Wire();
			
			
			socket.addWire(wire1);
			
			doh.f(socket.removeWire(wire2));
			doh.t(socket.removeWire(wire1));
			

			socket.addWire(wire1);
			socket.addWire(wire2);
			
			doh.t(socket.removeWire(wire1));
			doh.t(socket.hasWire(wire2));
			doh.t(socket.removeWire(wire2));
			
			doh.is(0,socket._wires.size());
		},
		
		function testMetaSocket(){
			var module = cs.library.getNewModule("cs.module.custom.test3");
			var field1 = new cs.model.program.Field(module.getMetaData().getFields().get(0),module,"hello world");
			
			var module2 = cs.library.getNewModule("cs.module.custom.test3");
			var field2 = new cs.model.program.Field(module2.getMetaData().getFields().get(0),module,"hello world");
			
			doh.is(field1.getMetaData(),field2.getMetaData());
		}
	]);
