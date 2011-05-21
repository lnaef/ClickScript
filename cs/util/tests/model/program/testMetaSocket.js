/**
 * @author elcc
 */

dojo.provide("cs.util.tests.model.program.testMetaSocket");

dojo.require("cs.model.meta.MetaSocket");

doh.register("cs.util.tests.model.program.testMetaSocket", [

	function testConstructor(){
		var type = cs.library.getType("cs.type.String");
		var mode = cs.model.meta.MetaSocket.MODE_INPUT;
		var name = "text";
		var position = 2;
		
		var MetaSocket = new cs.model.meta.MetaSocket(name, type, mode, position);
		
		doh.is("cs.type.String",MetaSocket.getType().getName());
		doh.is(cs.model.meta.MetaSocket.MODE_INPUT,MetaSocket.getMode());
		doh.is(name,MetaSocket.getName());
		doh.is(position,MetaSocket.getPosition());
	},
	
	function testModeChecker(){
		var type = cs.library.getType("cs.type.String");
		var mode = cs.model.meta.MetaSocket.MODE_INPUT;
		var name = "text";
		var position = 2;
		
		var MetaSocket = new cs.model.meta.MetaSocket(name, type, mode, position);
		
		doh.t(MetaSocket.isInput());
		doh.f(MetaSocket.isOutput());
		doh.f(MetaSocket.isField());
		
		var MetaSocket2 = new cs.model.meta.MetaSocket(name, type, cs.model.meta.MetaSocket.MODE_OUTPUT, position);
		doh.t(MetaSocket2.isOutput());
		
		var MetaSocket3 = new cs.model.meta.MetaSocket(name, type, cs.model.meta.MetaSocket.MODE_INPUT_FIELD, position);
		doh.t(MetaSocket3.isField());
	}
	
]);



