/**
 * @author lnaef
 */
dojo.provide("cs.util.tests.type.testStructure");

dojo.require("cs.type.Structure");

doh.register("cs.util.tests.type.testStructure", [

	function structureConstructor(){
	  var typeStructure = new cs.type.Structure();
	  doh.is(0,typeStructure.getSize());
	},
	
	function structureAddAttribute(){
	  var typeStructure = new cs.type.Structure("cs.type.custom.TelNr");
	  cs.library.addTypeStructure(new cs.type.Type(typeStructure));
	  typeStructure.addAttribute("name",cs.library.getType("cs.type.String"));
	  typeStructure.addAttribute("plz",cs.library.getType("cs.type.Number"));
	  typeStructure.addAttribute("tel",cs.library.getType("cs.type.custom.TelNr",true));

	  doh.is(3, typeStructure.getSize());
	},
	
	function structuregetAttribute(){
	  var typeStructure = new cs.type.Structure();
	  //done by function before todo: tear down on upper function
	  //cs.library.addTypeStructure(new cs.type.Type("cs.type.custom.TelNr",true));
	  typeStructure.addAttribute("name",cs.library.getType("cs.type.String"));
	  typeStructure.addAttribute("plz",cs.library.getType("cs.type.Number"));
	  typeStructure.addAttribute("tel",cs.library.getType("cs.type.custom.TelNr",true));

	  doh.is("cs.type.String", typeStructure.getAttribute("name"));
	  doh.f(typeStructure.getAttribute("name").isCollection());
	  doh.t(typeStructure.getAttribute("tel").isCollection());		
	}
	
	
	
]);
