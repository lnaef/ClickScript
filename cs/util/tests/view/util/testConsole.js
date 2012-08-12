/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.view.util.testConsole");

	dojo.require("cs.view.util.Console");
	
	doh.register("cs.util.tests.view.program.testConsole", [

		function testother(){
			var csConsole = new cs.view.util.Console(null,"console",{color:"#f00", margin:20, width:600});
			csConsole.println("hello world");
			csConsole.println("on next line");
			csConsole.read("enter your message: ");
			csConsole.println("since console is reading, this message should not appear!");
			dojo.connect(csConsole,"onAfterReading",function(value){
				console.log("i've read in console: ", value);
			});
		}
	]);		