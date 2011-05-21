/**
 * @author elcc
 */
	dojo.provide("cs.util.tests.controller.testLibraryController");

	dojo.require("cs.controller.LibraryController");
	
	doh.register("cs.util.tests.controller.testLibraryController", [
		
		function getNewModule(){
			
			cs.library.addMetaComponent({
				name : "cs.module.string.concat",
				description : "This module concats two inputstrings.",
				inputs : [cs.library.getType("cs.type.String"),cs.library.getType("cs.type.String")],
				outputs : [cs.library.getType("cs.type.String")],
				fields : []/*,
				function(a,b,c){console.log(a,b,c,arguments,a.value+b.value);c.value = a.value+b.value;}*/
			});
	
		
			var a = cs.library.getNewModule("cs.module.string.concat");
			var b = cs.library.getNewModule("cs.module.string.concat");
			doh.f(a==b);
			
			doh.t(cs.util.isTypeOf(a,"cs.model.program.Component"));
			doh.is(a.getInputSocket(0).getType(),"cs.type.String");
		},
		
		function getType(){
			var t1 = cs.library.getType("cs.type.String");
			var t2 = cs.library.getType("cs.type.Boolean",true);
			doh.is("cs.type.String",t1.getName());
			doh.is("Collection<cs.type.Boolean>",t2.getName());
		}
	]);
