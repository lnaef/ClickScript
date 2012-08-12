/**
 * ClickScript - ClickScript is a visual programming language. This is a 
 * data flow programming language running entirely in a web browser.
 * Copyright (C) 2012 Lukas Naef
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * @author lnaef
 * 
 * Class cs.controller.Serializer 
 * 
 * @description: This is a helper class to serialize an DOM-Element.
 * It also Generates the singleton cs.global.serializer which is a helper for serialisation
 */
	
	dojo.provide("cs.system.ScriptPlayer");
	
	dojo.require("dojox.xml.parser");
	
	dojo.declare("cs.system.ScriptPlayer", null, {
		
		constructor : function(){
			
		},
		
		/**
		 * Is needed because of a IE Bug
		 */
		_getXMLDomAttribute : function(node,attr){
			return dojo.isIE ? node.getAttribute(attr) : dojo.attr(node,attr);
		},
		
		run : function(/*string*/ a_script){

			var clickscript = a_script || dojo.attr("csTestTextarea","value");
			var clickscriptAsDom = dojox.xml.parser.parse(clickscript);
			
			/**
			 * Map with mapping of: uid -> new ModelObject
			 */
			var socketMap = cs.util.Map();
			var blockMap = cs.util.Map();
			

			// Get all Components
			var test = dojo.query("component",clickscriptAsDom).forEach(function(componentNode, index, arr){

				var type = this._getXMLDomAttribute(componentNode,"type");


				/**
				 * Place this attibute-keys to a seperate class
				 */
				// attributes on component level
				var uid = parseInt(this._getXMLDomAttribute(componentNode,"uid"),10);
				var parentBlock = this._getXMLDomAttribute(componentNode,"_reference-parent");
		
				var componentType = this._getXMLDomAttribute(componentNode, "component-type");
				var coordProgX = parseFloat(this._getXMLDomAttribute(componentNode,"coord-prog-x"));
				var coordProgY = parseFloat(this._getXMLDomAttribute(componentNode,"coord-prog-y"));
				var coordExecX = parseFloat(this._getXMLDomAttribute(componentNode,"coord-exec-x"));
				var coordExecY = parseFloat(this._getXMLDomAttribute(componentNode,"coord-exec-y"));
			
				console.log("Play Component: "+this._getXMLDomAttribute(componentNode,"uid")+" [ uid: "+uid+", type: "+type+"]");
				
				/*
				 * ADD NEW COMPONENT TO THE MODEL
				 */
				var component = null;
				if (type != "cs.statement.program"){
					component = cs.modelController.addComponent(type,{x:coordProgX,y:coordProgY},{x:coordExecX,y:coordExecY});
					cs.modelController.moveComponentToBlock(component,blockMap.get(parentBlock));
				} else {
					component = cs.modelController.getRootStatement();
				}
				
				var inputSockets = null;
				// Input sockets
				if(!dojo.isIE){
					inputSockets = dojo.query("inputs > socket",componentNode);
				} else {
					inputSockets = new cs.util.Container();
					dojo.forEach(dojo.query("inputs",componentNode),function(inputs){
						dojo.forEach(dojo.query("socket",inputs),function(socket){
							inputSockets.add(socket);
						});
					});
				}
				if(inputSockets){
					inputSockets.forEach(function(socket,index){
						socketMap.put(this._getXMLDomAttribute(socket,"uid"),component.getInputSocket(index));
					},this);
				}
				
				// Output sockets
				var outputSockets = null;
				if(!dojo.isIE){
					outputSockets = dojo.query("outputs > socket",componentNode);
				} else {
					outputSockets = new cs.util.Container();
					dojo.forEach(dojo.query("outputs",componentNode),function(outputs){
						dojo.forEach(dojo.query("socket",outputs),function(socket){
							outputSockets.add(socket);
						});
					});
				}
				if(outputSockets){
					outputSockets.forEach(function(socket,index){
						socketMap.put(this._getXMLDomAttribute(socket,"uid"),component.getOutputSocket(index));
					},this);
				}
				
				// Field sockets
				var fieldSockets = null;
				if(!dojo.isIE){
					fieldSockets = dojo.query("fields > field",componentNode);
				} else {
					fieldSockets = new cs.util.Container();
					dojo.forEach(dojo.query("fields",componentNode),function(fields){
						dojo.forEach(dojo.query("field",fields),function(socket){
							fieldSockets.add(socket);
						});
					});
				}
				
				
				
				
				if(fieldSockets){
					fieldSockets.forEach(function(socket,index){
						socketMap.put(this._getXMLDomAttribute(socket,"uid"),component.getFieldSocket(index));
						var value = this._getXMLDomAttribute(socket,"value");
						
						/**
						 * Depending on the fieldtype we have to parse the value first.
						 * Get the fieldtype first.
						 */
						if(value){
							switch(cs.library.getMetaComponent(type).getField(index).getType().getName()){
								case "cs.type.Number": 
									cs.modelController.updateFieldSocket(component.getFieldSocket(index),parseFloat(value));
									break;
								case "cs.type.Boolean": 
									cs.modelController.updateFieldSocket(component.getFieldSocket(index),(value == "true" || value == "1"));
									break;
								default:
									cs.modelController.updateFieldSocket(component.getFieldSocket(index),value);
							}
						}
					},this);
				}					
				
				// blocks
				var blocks = dojo.query("block",componentNode);
				if(blocks){
					blocks.forEach(function(block,index){
						var blockWidth = parseFloat(this._getXMLDomAttribute(block,"width"));
						var blockHeight = parseFloat(this._getXMLDomAttribute(block,"height"));
						var blockUid = this._getXMLDomAttribute(block,"uid");
						
						/**
						 * do not resize the program component!
						 */
						if(!component.isProgram()){
							cs.modelController.updateBlockDimension(component.getBlock(index),{width: blockWidth, height: blockHeight });
							console.log("SCRIPT-PLAYER: Resize block "+blockUid+ " to dimension width:"+blockWidth+" height: "+blockHeight);
						}
						// put the block to the block map
						blockMap.put(blockUid, component.getBlock(index));	
					},this);
				}
			
			      
			    // TODO:set execview
			    // TODO:set parent
			    // Resize Blocks if Statement
				//TODO: TESTSCRIPT for Import

			},this);
			
			
			// Get all Wires
			var from = -1;
			var to = -1;
			dojo.query("wire",clickscriptAsDom).forEach(function(node, index, arr){
				try {
					from = this._getXMLDomAttribute(node,"_reference-from");
					to = this._getXMLDomAttribute(node,"_reference-to");
					cs.modelController.connectSockets(socketMap.get(from),socketMap.get(to));
					console.log("Play Wire: FROM "+from+", TO "+ to);
				} catch (e) {
					console.log("Error occured on importing wire, near wire: from "+from+", to " + to);
				}

			      // Do the connection
			},this);

			
		}
	});
	
	cs.global.scriptPlayer = new cs.system.ScriptPlayer();

	
	/**
	 * TIP: dojox.xml.DomParser.parse(xml)
	 */


	
