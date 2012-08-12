/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.model.program.testWire");
	
	dojo.require("cs.model.program.Wire");
	dojo.require("cs.model.program.Socket");
	
	doh.register("cs.util.tests.model.program.testWire", [
		
		function wireConstructor(){
			var wire = new cs.model.program.Wire();
		},
		
		function wireConnectTo(){
			var wire = new cs.model.program.Wire();
			var module = cs.library.getNewModule("cs.module.custom.test");
			var sI0 = module.getInputSocket(0);
			var sO0 = module.getOutputSocket(0);
			
			wire.connectTO(sI0);		
			
			// wire points to sI0
			doh.is(wire.getTO(),sI0);
			
			// the socket has registred the wire
			doh.t(sI0.hasWire(wire));
			
			// the module behind the socket is the one of the socket
			//doh.t(wire.getTO().getComponent(),module);
			
			doh.t(wire.getTO(),module.getInputSocket(0));
			
			// we change the wire to the sO0
			wire.connectTO(sO0);
			
			// wirte is connected to sO0;
			doh.is(wire.getTO(),sO0);
			
			// the socket sO0 has is connected to the wire
			doh.t(sO0.hasWire(wire));
			
			// sI0 is no longer connected with this wire
			doh.f(sI0.hasWire(wire));
			doh.f(sI0 == wire.getTO());
			
		},
		
		function wireConnectFrom(){
			var wire = new cs.model.program.Wire();
			var module = cs.library.getNewModule("cs.module.custom.test");
			var sI0 = module.getInputSocket(0);
			var sO0 = module.getOutputSocket(0);
			
			wire.connectFROM(sI0);		
			
			// wire points to sI0
			doh.is(wire.getFROM(),sI0);
			
			// the socket has registred the wire
			doh.t(sI0.hasWire(wire));
			
			// the module behind the socket is the one of the socket
			//doh.t(wire.getFROM().getComponent(),module);
			doh.t(wire.getFROM(),module.getInputSocket(0));
			
			// we change the wire to the sO0
			wire.connectFROM(sO0);
			
			// wirte is connected to sO0;
			doh.is(wire.getFROM(),sO0);
			
			// the socket sO0 has is connected to the wire
			doh.t(sO0.hasWire(wire));
			
			// sI0 is no longer connected with this wire
			doh.f(sI0.hasWire(wire));
			doh.f(sI0 == wire.getFROM());
		},
		
		function disconnectSingle() {
			var wire = new cs.model.program.Wire();
			var module = cs.library.getNewModule("cs.module.custom.test");
			var sI0 = module.getInputSocket(0);
			var sO0 = module.getOutputSocket(0);
			
			//connect wire to the two socekts
			wire.connect(sI0);
			wire.connect(sO0);
			
			doh.t(wire.getTO());
			doh.t(wire.getFROM());
			doh.f(wire.getTO() == wire.getFROM());
			doh.t(sI0.hasWire(wire));
			
			// disconnect from TO
			wire.disconnectTO();
			doh.f(wire.getTO());
			doh.t(wire.getFROM());
			
			// disconnect from FROM
			wire.disconnectFROM();
			doh.f(wire.getTO());
			doh.f(wire.getFROM());
			doh.f(sI0.hasWire(wire));
		}, 
		
		function disconnect(){
			var wire = new cs.model.program.Wire();
			var module = cs.library.getNewModule("cs.module.custom.test");
			var sI0 = module.getInputSocket(0);
			var sO0 = module.getOutputSocket(0);
			
			//connect wire to the two socekts
			wire.connect(sI0);
			wire.connect(sO0);
			
			doh.t(wire.getTO());
			doh.t(wire.getFROM());
			doh.f(wire.getTO() == wire.getFROM());
			doh.t(sI0.hasWire(wire));
			doh.t(sO0.hasWire(wire));
			
			// disconnect both
			wire.disconnect();
			doh.f(wire.getTO());
			doh.f(wire.getFROM());
			
			doh.f(sI0.hasWire(wire));
			doh.f(sO0.hasWire(wire));
		}
		
		
	]);
