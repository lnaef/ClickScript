/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.view.program.testSocket");

	dojo.require("cs.view.program.Socket");
	
	doh.register("cs.util.tests.view.program.testSocket", [
		function constructorTest(){

			//setup gfx test
			var test = cs.test.setupGFXtest("testSocket.js","simple sockets widthout move functionality");
			var y = test.y;	
			var x = test.x;
			
			var module = cs.library.getNewModule("cs.module.custom.test");
			var socket = new cs.view.program.Socket(cs.test.playground, {
				x: x,
				y: y
			}, module.getInputSocket(0));
			var socket = new cs.view.program.Socket(cs.test.playground, {
				x: x+100,
				y: y
			}, module.getInputSocket(1));
			var socket = new cs.view.program.Socket(cs.test.playground, {
				x: x+200,
				y: y
			}, module.getOutputSocket(0));
		}
	]);		