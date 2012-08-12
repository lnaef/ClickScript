/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.view.util.testInputTextHandler");

	dojo.require("cs.view.util.InputTextHandler");
	
	doh.register("cs.util.tests.view.program.testInputTextHandler", [

		function testHandler(){
			//setup gfx test
			var test = cs.test.setupGFXtest("testInputTextHandler.js","creates a input text field and activates till 'ENTER'");
			var y = test.y;
			var x = test.x;
			
			// draw simple textfield
			var textshape = cs.test.playground.createText({x:x,y:y,text:"jepp it works",align:"left"}).setFill("#000");
			
			// generate reader
			var inputfield = new cs.view.util.InputTextHandler(null,textshape);
			dojo.connect(inputfield,"onAfterReading",function(){inputfield.read();});
			
			//activate reading
			inputfield.read();
		}
	]);		