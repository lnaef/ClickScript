/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.view.program.testModule");

	dojo.require("cs.view.program.Component");
	dojo.require("cs.view.program.Socket");
	
	doh.register("cs.util.tests.view.program.testModule", [
		function constructorTest(){
			
			//setup gfx test
			var test = cs.test.setupGFXtest("testModule.js","creates movable module from module-model, 2nd width default picture");
			var y = test.y;	
			var x = test.x;
			
			var moduleModel = cs.library.getNewModule("cs.module.custom.test");
			var moduleModel2 = cs.library.getNewModule("cs.module.custom.test2");
			var moduleModel3 = cs.library.getNewModule("cs.module.custom.test3");
				moduleModel3.getFieldSockets().get(0).setValue("This is a very long value");
				
			var module = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2),y:y},moduleModel);
			var module = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2) + 100,y:y},moduleModel2);
			var module = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2) + 200,y:y},moduleModel3);
			
		},
		
		function primitiveTest(){
			//setup gfx test
			var test = cs.test.setupGFXtest("testModule.js","Show three prmitive modules");
			var y = test.y;	
			var x = test.x;
			
			var moduleModel = cs.library.getNewModule("cs.default.primitive.string");
				moduleModel.getFieldSockets().get(0).setValue("House");
			var moduleModel2 = cs.library.getNewModule("cs.default.primitive.number");
				moduleModel2.getFieldSockets().get(0).setValue("1");	
			var moduleModel3 = cs.library.getNewModule("cs.default.primitive.boolean");
				moduleModel3.getFieldSockets().get(0).setValue("true");			
			
			var module = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2),y:y+50},moduleModel);
			var module2 = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2)+100,y:y+50},moduleModel2);
			var module3 = new cs.view.program.Component(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2)+200,y:y+50},moduleModel3);
		
		}
	]);		