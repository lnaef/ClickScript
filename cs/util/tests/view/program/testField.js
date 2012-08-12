/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.view.program.testField");

	dojo.require("cs.view.program.Field");
	
	doh.register("cs.util.tests.view.program.testField", [
		function constructorTest(){

			//setup gfx test
			var test = cs.test.setupGFXtest("testField.js","simple value sockets widthout move functionality, first empty value, second with text and third after deleting the value in the model");
			var y = test.y;
			var x = test.x;
			
			var module = cs.library.getNewModule("cs.module.custom.test3");
			var field = new cs.view.program.Field(cs.test.playground, {
				x: x,
				y: y
			}, module.getFieldSocket(0));
			
			var module = cs.library.getNewModule("cs.module.custom.test3");
			module.getFieldSocket(0).setValue("hello you are the one i alway");
			var field2 = new cs.view.program.Field(cs.test.playground, {
				x: x+100,
				y: y
			}, module.getFieldSocket(0));
			
			var module = cs.library.getNewModule("cs.module.custom.test3");
			module.getFieldSocket(0).setValue("");
			var field3 = new cs.view.program.Field(cs.test.playground, {
				x: x+200,
				y: y
			}, module.getFieldSocket(0));
		}
	]);		