/**
 * @author elcc
 * 
 */
	
	dojo.provide("cs.controller.ModelControllerObserver");
	
 	dojo.declare("cs.controller.ModelControllerObserver", null, {
		onAddComponent : function(){},
		onConnectSockets : function(){},
		onDeleteWire : function(){},
		onDeleteComponent : function(){},
		onUpdateFieldSocket : function(){},
		onMoveComponentToBlock : function(){},
		onFocusComponent : function(){},
		onBlurComponent : function(){}	
	});