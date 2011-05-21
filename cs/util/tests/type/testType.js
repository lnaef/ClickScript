/**
 * @author elcc
 */

dojo.provide("cs.util.tests.type.testType");

dojo.require("cs.type.Type");
doh.register("cs.util.tests.type.testType", [

	function typeConstructor(){
		
		// is collection
		var structure = new cs.type.Structure("cs.type.test");
		var type = new cs.type.Type(structure,true);
		doh.is("Collection<cs.type.test>",type.getName());
		doh.is(type.isCollection(),true);
		
		// not is collection
		var type2 = new cs.type.Type(structure);
		doh.is("cs.type.test",type2.getName());
		doh.is(type2.isCollection(),false);
		
		// constructor with string
		var type3 = new cs.type.Type("cs.simple.type");	
		doh.is(0,type3.getStructure().getSize());
	},
	
	function typeEquals(){
		var type1 = new cs.type.Type(new cs.type.Structure("cs.type.equ"),false);
		var type2 = new cs.type.Type(new cs.type.Structure("cs.type.equu"),false);
		var type3 = new cs.type.Type(new cs.type.Structure("cs.type.equ"),true);
		var type4 = new cs.type.Type(new cs.type.Structure("cs.type.equ"),true);

		doh.t(type3.equals(type4));
		doh.t(type3.equals(type3));
		doh.f(type1.equals(type2));
		doh.f(type1.equals(type3));
	},
	
	function typeToString(){
		var type = new cs.type.Type(new cs.type.Structure("test"));
		var typeCollection = new cs.type.Type(new cs.type.Structure("foo"),true);
		
		doh.is("test" ,type+"");
		doh.is("Collection<foo>", typeCollection + "");
	}
	
	
]);
