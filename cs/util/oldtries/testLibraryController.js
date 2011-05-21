/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.controller.testLibraryController");

	dojo.require("cs.controller.LibraryController");
	
	doh.register("cs.util.tests.controller.testLibraryController", [
		
		function init(){
			var a = cs.library.getNewModule("cs.module.string.concat");
			var b = cs.library.getNewModule("cs.module.string.concat");
			doh.f(a==b);
			a.hi();
			
			var a = cs.library.getMetadata("cs.module.string.concat2");
			var c = {value:0};
			a.exec({value:1},{value:2},c);
			doh.is(3,c.value);
		}
	]);
