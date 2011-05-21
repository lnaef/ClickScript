/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.util.testReader");
	
	dojo.require("cs.util.Reader");
	
	doh.register("cs.util.tests.util.testReader", [
		
		function testit(){
				var i = 0;
				dojo.provide("cs.view.util.TestReader");
				dojo.declare("cs.view.util.TestReader", cs.util.Reader, {
					updateText : function(a_text,loadCursor){
						console.log(a_text,loadCursor);
					},
					onAfterReading : function(a_text){
						console.log("i've read: ", a_text);
						this.read("and again: ");
					},
					onAbortReading : function(a_text_before_abort){
						console.log("abort reading with value: " + a_text_before_abort);
					}
				});
				var reader = new cs.view.util.TestReader();
				reader.read();
		}
		
		
	]);
