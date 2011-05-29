/**
 * @author elcc
 * 
 * Class cs.controller.Serializer 
 * 
 * @description: This is a helper class to serialize an DOM-Element.
 * It also Generates the singleton cs.global.serializer which is a helper for serialisation
 */
	
	dojo.provide("cs.system.scriptPlayer");
	
	dojo.require("dojox.xml.parser");
	
 	dojo.declare("cs.system.scriptPlayer", null, {
		
		constructor : function(){
			
		},
		
		run : function(/*string*/ a_script){
			var clickscript = dojo.attr("csTestTextarea","value");
			var clickscriptAsDom = dojox.xml.parser.parse(clickscript);
			
			/**
			 * Map with mapping of: uid -> new ModelObject
			 */
			var socketMap = cs.util.Map();
			var blockMap = cs.util.Map();
			
			
			// Get all Components
			var test = dojo.query("component",clickscriptAsDom).forEach(function(componentNode, index, arr){
			      
  				var type = dojo.attr(componentNode,"type");
  				if (type != "cs.statement.program"){
	
					/**
					 * Place this attibute-keys to a seperate class
					 */
					// attributes on component level
					var uid = parseInt(dojo.attr(componentNode,"uid"));
					var parentBlock = dojo.attr(componentNode,"_reference-parent");
					
					var componentType = dojo.attr(componentNode, "component-type");
					var coordProgX = parseFloat(dojo.attr(componentNode,"coord-prog-x"));
					var coordProgY = parseFloat(dojo.attr(componentNode,"coord-prog-y"));
					var coordExecX = parseFloat(dojo.attr(componentNode,"coord-exec-x"));
					var coordExecY = parseFloat(dojo.attr(componentNode,"coord-exec-y"));
					
					console.log("Play Component: "+dojo.attr(componentNode,"uid")+" [ uid: "+uid+", type: "+type+"]");
					
					/*
					 * ADD NEW COMPONENT TO THE MODEL
					 */
					var component = cs.modelController.addComponent(type,coordProgX,coordProgY);
					
					// Input sockets
					var inputSockets = dojo.query("inputs > socket",componentNode);
					if(inputSockets){
						inputSockets.forEach(function(socket,index){
							socketMap.put(dojo.attr(socket,"uid"),component.getInputSocket(index));
						});
					}
					
					// Output sockets
					var outputSockets = dojo.query("outputs > socket",componentNode);
					if(outputSockets){
						outputSockets.forEach(function(socket,index){
							socketMap.put(dojo.attr(socket,"uid"),component.getOutputSocket(index));
						});
					}
					
					// Field sockets
					var fieldSockets = dojo.query("fields > field",componentNode);
					if(fieldSockets){
						fieldSockets.forEach(function(socket,index){
							socketMap.put(dojo.attr(socket,"uid"),component.getFieldSocket(index));
							var value = dojo.attr(socket,"value");
							
							/**
							 * Depending on the fieldtype we have to parse the value first.
							 * Get the fieldtype first.
							 */
							switch(cs.library.getMetaComponent(type).getField(index).getType()){
								case "cs.type.Number": 
									component.getFieldSocket(index).setValue(parseFloat(value));
									break;
								case "cs.type.Boolean": 
									component.getFieldSocket(index).setValue(value == "true" || value == "1");
									break;
								default:
									component.getFieldSocket(index).setValue(value);
							};
						});
					}					
					
					// blocks
					var blocks = dojo.query("block",componentNode);
					if(blocks){
						blocks.forEach(function(block,index){
							component.getBlock(index).setDimension({width: dojo.attr(block,"width"), height: dojo.attr(block,"height") });
							blockMap.put(dojo.attr(block,"uid"),component.getBlock(index));	
						});
					}
				
				      
				    // Set Component at the right position
				    // Resize Blocks if Statement
			   		//TODO: TESTSCRIPT for Import
			   }
			});
			
			
			// Get all Wires
			var from = -1;
			var to = -1;
			dojo.query("wire",clickscriptAsDom).forEach(function(node, index, arr){
				try {
					from = dojo.attr(node,"_reference-from");
					to = dojo.attr(node,"_reference-to");
					cs.modelController.connectSockets(socketMap.get(from),socketMap.get(to));
			      	console.log("Play Wire: FROM "+from+", TO "+ to);
				} catch (e) {
					console.log("Error occured on importing wire, near wire: from "+from+", to " + to);
				}

			      // Do the connection
			});

			
		}
	});
	
	cs.global.scriptPlayer = new cs.system.scriptPlayer();

	
	/**
	 * TIP: dojox.xml.DomParser.parse(xml)
	 */


	
