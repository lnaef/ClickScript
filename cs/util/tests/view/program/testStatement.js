/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.view.program.testStatement");

	dojo.require("cs.view.program.Statement");
	
	doh.register("cs.util.tests.view.program.testStatement", [
		function constructorTest(){
			
			//setup gfx test
			var test = cs.test.setupGFXtest("testStatement.js","a if statement");
			var y = test.y;	
			var x = test.x;
			
			var statementModel = cs.library.getNewStatement("cs.statement.if");
				
			var statementShape = new cs.view.program.Statement(cs.test.playground,{x:x+Math.round(cs.view.program.Component.dim.width/2),y:y},statementModel);
			
			cs.test.increaseCurrentY(200);
		},
		

	]);		