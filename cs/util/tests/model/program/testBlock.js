/**
 * @author elcc
 */
dojo.provide("cs.util.tests.model.program.testBlock");

dojo.require("cs.model.program.Block");

doh.register("cs.util.tests.model.program.testBlock", [

	function blockConstructor(){
		var block = new cs.model.program.Block();
		doh.is(block.getComponentContainer().size(),0);
	    doh.is(block.getBlocks().size(),0);	
	},
	
	function blockAddModule(){
		var block = new cs.model.program.Block();
		var module = cs.library.getNewModule("cs.module.custom.test");
		var module2 = cs.library.getNewModule("cs.module.custom.test2");
		var block2 = new cs.model.program.Block();
		
		block.addComponent(module);
		// link of module to its block has to be updated
		doh.is(block,module.getParentBlock());
		
		block.addComponent(module2);
		doh.is(2,block.getComponentContainer().size());
		doh.is(0,block2.getComponentContainer().size());
		
		block2.addComponent(module);
		block2.addComponent(module2);
		doh.f(block.getComponentContainer()==block2.getComponentContainer());
	},
	
	function addStatement(){
		var statement = cs.library.getNewStatement("cs.statement.program");
		var statementBlock = new cs.model.program.Block();
		statement.addBlock(statementBlock);
		
		// test whether a block of a statement automatically gots added to the block
		var block = new cs.model.program.Block();
		block.addComponent(statement);
		doh.t(block.hasBlock(statementBlock));
	},
	
	function blockHasModule(){
		var block = new cs.model.program.Block();
		var module = cs.library.getNewModule("cs.module.custom.test");
		var module2 = cs.library.getNewModule("cs.module.custom.test");
		block.addComponent(module);
		doh.t(block.hasComponent(module));
		doh.f(block.hasComponent(module2));
	},
	
	function blockAddBlock(){
		var block = new cs.model.program.Block();
		var childBlock1 = new cs.model.program.Block();
		var childBlock2 = new cs.model.program.Block();
		block.addBlock(childBlock1);
		doh.t(block.hasBlock(childBlock1));
		doh.f(block.hasBlock(childBlock2));		
		doh.is(0,childBlock1.getBlocks().size());
	},
	
		function blockRemoveModule(){
		var block = new cs.model.program.Block();
		var module = cs.library.getNewModule("cs.module.custom.test");
		
		block.addComponent(module);
		doh.t(block.hasComponent(module));
		block.removeComponent(module);
		doh.f(block.hasComponent(module));
	},
	
	function blockRemoveBlock(){
		var block = new cs.model.program.Block();
		var childBlock1 = new cs.model.program.Block();
		
		block.addBlock(childBlock1);
		doh.t(block.hasBlock(childBlock1));
		block.removeBlock(childBlock1);
		doh.f(block.hasBlock(childBlock1));		
		doh.is(0,block.getBlocks().size());
	},
	
	function blockCheckDimension(){
		var block = new cs.model.program.Block();
		block.setDimension({width:12,height:13});
		doh.is(12,block.getDimension().width);
		doh.is(13,block.getDimension().height);
	},
	
	function blockDefaultSize(){
		var block = new cs.model.program.Block();
		doh.is(cs.model.program.Block.dim.width, block.getDimension().width);	
		doh.is(cs.model.program.Block.dim.height, block.getDimension().height);
	}
	
]);
