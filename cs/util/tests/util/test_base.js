/**
 * @author lnaef
 */

dojo.provide("cs.util.tests.util.test_base");

dojo.require("cs.util._base");
dojo.require("cs.model.program.Block");
dojo.require("cs.model.program.Statement");

doh.register("cs.util.tests.util._base", [

	function getClassname(){
		var block = new cs.model.program.Block();
		doh.is("cs.model.program.Block",cs.util.getClassname(block));
	},
	
	function hasSuperclass(){
		var block = new cs.model.program.Block();
		doh.f(cs.util.hasSuperclass(cs.util.getClassname(block)));
	
		var statement = cs.library.getNewStatement("cs.statement.program");
		doh.t(cs.util.hasSuperclass(cs.util.getClassname(statement)));
	},
	
	function isTypeOf(){
		var block = new cs.model.program.Block();
		doh.t(cs.util.isTypeOf(block,"cs.model.program.Block"));
		doh.f(cs.util.isTypeOf(block,"cs.model.program.Con"));
	
		var statement = cs.library.getNewStatement("cs.statement.program");
		doh.t(cs.util.isTypeOf(statement,"cs.model.program.Component"));
		doh.f(cs.util.isTypeOf(statement,"cs.model.program.Block"));		
	},
	
	function test(){
			dojo.declare("cs.a", null, {});
			dojo.declare("cs.b", null, {});
			dojo.declare("cs.c", [cs.a,cs.b], {});
			var a = cs.util.getClassDefinition("cs.c");
			//problem of superclasses > getSuperclasses will return just one string: "cs.a_cs.b"
	}
	
	
	
]);
