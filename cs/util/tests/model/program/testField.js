/**
 * @author lnaef
 */
	dojo.provide("cs.util.tests.model.program.testField");
	
	dojo.require("cs.controller.LibraryController");
	dojo.require("cs.model.program.Wire");
	dojo.require("cs.model.program.Field");
	
	doh.register("cs.util.tests.model.program.testField", [
		
		function testConstructor(){
			var module = cs.library.getNewModule("cs.module.custom.test3");
			var field = new cs.model.program.Field(module.getMetaData().getFields().get(0),module,"hello world");

			doh.t(field.isField());
			doh.f(field.isOutput());
			doh.is(field.getPosition(),0);
			

		},
		
		function testValue(){
			var module = cs.library.getNewModule("cs.module.custom.test3");
			var field = new cs.model.program.Field(module.getMetaData().getFields().get(0),module,"hello world");

			doh.is("hello world", field.getValue());
			field.setValue("abc");
			doh.is("abc", field.getValue());
		
		}

	]);
