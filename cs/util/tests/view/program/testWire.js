/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.view.program.testWire");

	dojo.require("cs.view.program.Socket");
	dojo.require("cs.view.program.Wire");
	dojo.require("cs.model.program.Wire");
	
	doh.register("cs.util.tests.view.program.testWire", [
		function constructorTest(){
			//setup gfx test
			var test = cs.test.setupGFXtest("testWire.js","connects two movable sockets");
			var y = test.y;	
			var x = test.x;
			
			
			var module= cs.library.getNewModule("cs.module.custom.test");
			
			var socket1 = new cs.view.program.Socket(cs.test.playground, {
				x: x,
				y: y
			}, module.getOutputSocket(0));
			var socket2 = new cs.view.program.Socket(cs.test.playground, {
				x: x+200,
				y: y
			}, module.getInputSocket(0));
			
			var moveable1 = new dojox.gfx.Moveable(socket1.getShape());
			var moveable2 = new dojox.gfx.Moveable(socket2.getShape());
			dojo.connect(moveable1,"onMove",socket1,"onMove");
			dojo.connect(moveable2,"onMove",socket2,"onMove");
			var wireModel = new cs.model.program.Wire();
			wireModel.connectFROM(socket1.getModel());
			wireModel.connectTO(socket2.getModel());
			var wire = new cs.view.program.Wire(cs.test.playground,socket1,socket2,wireModel);
			
			
		},
		
		function testWireAndModule(){
			//setup gfx test
			var test = cs.test.setupGFXtest("testWire.js > wire and Module","Both modules should be movable and the two wires should get updated");
			var y = test.y;	
			var x = test.x;	
			
			var moduleModel1 = cs.library.getNewModule("cs.module.custom.test");
			var module1 = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2),y:y},moduleModel1);
			var moduleModel2 = cs.library.getNewModule("cs.module.custom.test2");
			var module2 = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2)+200,y:y},moduleModel2);

			var s1 =module1.getOutputSockets().get(0);
			var s2 =module2.getInputSockets().get(0);
			var s3 =module1.getOutputSockets().get(0);
			var s4 =module2.getInputSockets().get(1);

			var wireModel1 = new cs.model.program.Wire();
			wireModel1.connectFROM(s1.getModel());
			wireModel1.connectTO(s2.getModel());
			
			var wireModel2 = new cs.model.program.Wire();
			wireModel2.connectFROM(s3.getModel());
			wireModel2.connectTO(s4.getModel());
		
			var wire = new cs.view.program.Wire(cs.test.playground,s1,s2,wireModel1);
			var wire = new cs.view.program.Wire(cs.test.playground,s3,s4,wireModel2);
			
			
		},
		
		
		function badWiring(){
			//setup gfx test
			var test = cs.test.setupGFXtest("testWire.js > badWiring","Input - input connection or output-output connections as well as the connection between to different typed sockets should break");
			var y = test.y;	
			var x = test.x;	
			
			var moduleModel1 = cs.library.getNewModule("cs.module.custom.test");
			var module1 = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2),y:y},moduleModel1);
			var moduleModel2 = cs.library.getNewModule("cs.module.custom.test");
			var module2 = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2)+200,y:y+10},moduleModel2);

			var s1 =module1.getOutputSockets().get(0);
			var s2 =module1.getInputSockets().get(0);
			var s3 =module2.getOutputSockets().get(0);
			var s4 =module2.getInputSockets().get(1);

			var wireModel1 = new cs.model.program.Wire();
			wireModel1.connectFROM(s1.getModel());
			wireModel1.connectTO(s3.getModel());
			
			var wireModel2 = new cs.model.program.Wire();
			wireModel2.connectFROM(s2.getModel());
			wireModel2.connectTO(s4.getModel());
		
			var wire = new cs.view.program.Wire(cs.test.playground,s1,s4,wireModel1);
			var wire2 = new cs.view.program.Wire(cs.test.playground,s2,s4,wireModel2);
		},
		
	]);		