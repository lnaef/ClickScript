/**
 * @author elcc
 * 
 * cs.model.program.Component - This class represents a Component with its inputs, outputs and fields
 * each component has also a link to a metadata object with its type specific information. A component is either 
 * a Module or a Statement
 */
	
	dojo.provide("cs.model.program.Component");
	
	dojo.require("cs.util.Container");
	dojo.require("cs.model.program.Socket");
	dojo.require("cs.model.program.Field");
	dojo.require("cs.controller.Serializer");
	
 	dojo.declare("cs.model.program.Component", null, {
		
		/**
		 * All Sockets of a component
		 * @type : cs.util.Container
		 */
		_inputSockets : null,
		_outputSockets : null,
		_fieldSockets:null,
		
		/**
		 * Block of current Module
		 */
		_parentBlock : null,
		
		/**
		 * Metadata of the Module 
		 */
		_metadata : null,
		
		
		/**
		 * x,y coordinates for the positioning on the view layers
		 */
		_positionProg : null, /* @type : {x:0,y:0}*/
		_positionExec : null, /* @type : {x:0,y:0}*/
		
		/**
		 * Needed for serialization
		 */
		_uid : null,
		
		
		/**
		 * Creates new Block object
		 * @param {cs.model.meta.MetaComponent} a_metadata
		 */
		constructor : function(a_metadata){
			this._metadata = a_metadata;
			this.setId(cs.serializer.getUid());
			this._positionProg = {x:0,y:0},
			this._positionExec = {x:0,y:0},
			
			// @todo: create new sockets of type x and add them instead of x.getName()
			
			// create needed sockets depending on the metacomponent
			this._inputSockets = new cs.util.Container();
			this._metadata.getInputs().forEach(function(x){
				this._inputSockets.add(new cs.model.program.Socket(x,this));
			},this);
			
			this._outputSockets = new cs.util.Container();
			this._metadata.getOutputs().forEach(function(x){	
				this._outputSockets.add(new cs.model.program.Socket(x,this));
			},this);
			
			this._fieldSockets = new cs.util.Container();
			this._metadata.getFields().forEach(function(x){		
				this._fieldSockets.add(new cs.model.program.Field(x,this));
			},this);
		},
		
		/**
		 * True if component is a primitive module
		 * A component is a primitive it if consists only of outputs and fields (no inputs)
		 */
		isPrimitive : function(){
			return this._metadata.isPrimitive();
		},
		isStatement : function(){
			return this._metadata.isStatement();
		},
		isModule : function(){
			return this._metadata.isModule();
		},
		
		
		setPositionProg : function(x,y){
			this._positionProg.x = x;
			this._positionProg.y = y;
		},
		
		setPositionExec : function(x,y){
			this._positionExec.x = x;
			this._positionExec.y = y;
		},
		
		setParentBlock : function(a_block){
			this._parentBlock = a_block;
		},
		
		hasParentBlock : function(){
			return this._parentBlock != null;
		},
		
		setId : function(a_int){
			this._uid = a_int;
		},
		
		
		/**
		 * Serialisation of: inputs, outputs, fields, wires and blocks (if statement) 
		 * All outgoing wires got serialized
		 * 
		 * @param {string} a_additionalData : used for example for Statement on superclass-call
		 */
		serialize : function(a_additionalData){
			
			var additionalData = a_additionalData || "";
			var componentType = this.getMetaData().getType();
			
			var input = "";
			this.getInputSockets().forEach(function(item){
				input += item.serialize();
			});
			input = cs.serializer.serialize("inputs",null,input);
			
			var output = "";
			this.getOutputSockets().forEach(function(item){
				output += item.serialize();
			});
			output = cs.serializer.serialize("outputs",null,output);
			
			var field = "";
			this.getFieldSockets().forEach(function(item){
				field += item.serialize();
			});
			field = cs.serializer.serialize("fields",null,field);
			
			var wires = "";
			this.getOutputSockets().forEach(function(socket){
				socket.forEachWire(function(wire){
					wires += wire.serialize();
				});				
			});
			
			var attributes = {
				'uid':this.getUid(),
				'component-type':componentType,
				'type':this.getMetaData().getName(),
				'coord-prog-x':this.getPositionProg().x,
				'coord-prog-y':this.getPositionProg().y		
			}
			
			if (this.getMetaData().hasView()){
				attibutes['coord-exec-x'] = this.getPositionExec().x,
				attibutes['coord-exec-y'] = this.getPositionExec().y		
			}
			
			
			return cs.serializer.serialize("component",attributes,input + output + field + additionalData + wires);
		},
		
		destroy : function(){
			
			// remove component from the parent block
			this.getParentBlock().removeComponent(this);
			
			this.getInputSockets().forEach(function(socket){
				socket.forEachWire(function(wire){
					wire.destroy();
				},this);
			},this);
			this.getOutputSockets().forEach(function(socket){
				socket.forEachWire(function(wire){
					wire.destroy();
				},this);
			},this);
			this.getFieldSockets().forEach(function(socket){
				socket.forEachWire(function(wire){
					wire.destroy();
				},this);
			},this);
			
			//TODO: move to statement class
			//problem of triggering event deleteComponent
			if(this.isStatement()){
				this.getBlocks().forEach(function(block){
					block.destroy();
				});
			}
			
			// trigger event
			// TODO: by publishing event
			cs.modelController.onDeleteComponent(this);
			
		},
		
		/**
		 * Getters
		 */
		getInputSockets : function(){return this._inputSockets;},
		getInputSocket : function(nbr){return this._inputSockets.get(nbr);},
		getOutputSockets : function(){return this._outputSockets;},
		getOutputSocket : function(nbr){return this._outputSockets.get(nbr);},
		getFieldSockets : function(){return this._fieldSockets;},
		getFieldSocket : function(nbr){return this._fieldSockets.get(nbr);},
		getMetaData : function () {return this._metadata;},
		getParentBlock : function(){return this._parentBlock;},
		getPositionProg : function(){return this._positionProg;},
		getPositionExec : function(){return this._positionExec;},
		getUid : function(){return this._uid;},
		
		
		getDescriptionAsHTML : function(){
			return this.getMetaData().toHTML();
		}
	});
