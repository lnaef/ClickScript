/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.view.util.testShape");

	dojo.require("cs.view.util.Shape");
	
	doh.register("cs.util.tests.view.program.testShape", [

		function testother(){
			
			//setup gfx test
			var test = cs.test.setupGFXtest("testShape.js","creates cs shape checks its additional methods");
			var y = test.y;
			var x = test.x;
			
			var shape = new cs.view.util.Shape(cs.test.playground);
			shape.createRect({
				x: x+10,
				y: y,
				width: 70,
				height: 30
			}).setFill("#ddd").setStroke({
					color: "#666",
					width: 3,
					join: "round"
				});
			shape.createRect({
				x: x,
				y: y+10,
				width: 50,
				height: 40
			}).setFill("#333").setStroke({
					color: "#666",
					width: 3,
					join: "round"
			});
			
			// test movability
			var moveable = new dojox.gfx.Moveable(shape.getShape());
			dojo.connect(moveable,"onMove",shape,"onMove");
			
			// check additional groupfeature
			/*var bb = null;//shape.getBoundingBox();
			doh.is(x,bb.x);
			doh.is(y,bb.y);
			doh.is(0,bb.r);
			doh.is(80,bb.width);
			doh.is(50,bb.height);	
	*/
		}
	]);		