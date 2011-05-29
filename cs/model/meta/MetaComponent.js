/**
 * @author elcc
 * 
 * CS.MODEL.meta.MetaComponent - This class represents the metadata about a component. Library data
 * of components will be converted to MetaComponents.
 * 
 * @todo move type to util package? add a controller or container.
 */
	dojo.provide("cs.model.meta.MetaComponent");

	dojo.require("cs.util.Container");
	dojo.require("cs.util._base");
	dojo.require("cs.model.meta.MetaSocket");
	dojo.require("cs.model.meta.MetaBlock");

	dojo.declare("cs.model.meta.MetaComponent", null, {
		
		/**
		 * Name of the Module
		 */
		_name : "undefined",
		
		/**
		 * Description about the Module
		 */
		_description : "",
		
		/**
		 * Image for the programming layer
		 */
		_imgPath : "",
		
		/**
		 * Meta view for execution layer
		 */
		_view : null,
		
		/**
		 * Types of the in- and outputs of the component and the fields
		 */
		_input : null,
		_output : null,
		_field : null,
		
		/**
		 * In case there are blocks refering to this model
		 */
		_blocks : null,
		
		/**
		 * type of component statement, module, primitive...
		 */
		_type : null,
		
		/**
		 * function to be executed should be of type:
		 * function(inputs,outputs,fields) 
		 */
		_exec : null,
		
		/**
		 * function to be execute before run to clean up
		 * mess if component has to reset something
		 */
		_reset: null,
		
		/**
		 * 
		 * @param {Object} a_data @see cs.model.meta.MetaComponent.defaultComponent
		 */

		constructor : function(a_data){
			
			var data = cs.util.smartMakeParameters(cs.model.meta.MetaComponent.defaultComponent,a_data);
			
			if(data.name){
				this._name = data.name;
				this._description = data.description;
				this._input = new cs.util.Container();
				this._output = new cs.util.Container();
				this._field = new cs.util.Container();
				this._blocks = new cs.util.Container();
				this._imgPath = data.image;
				this._view = data.view;
				this._exec = data.exec;
				this._reset = data.reset;
				
				// LOAD INPUTS
				if(dojo.isArrayLike(data.inputs)){
					for (var i = 0; i < data.inputs.length; i++) {					
						this._input.add(this._getMetaSocket(data.inputs[i],cs.model.meta.MetaSocket.MODE_INPUT,i));
					}
				} 
				else {
					throw Error("inputTypes have to be arrayLike in : '" + data.name+"'");
				}					
			
				// LOAD OUTPUTS
				if(dojo.isArrayLike(data.outputs)){
					for (var i = 0; i < data.outputs.length; i++) {
						this._output.add(this._getMetaSocket(data.outputs[i],cs.model.meta.MetaSocket.MODE_OUTPUT,i));
					}
				} 
				else {
					throw Error("output have to be arrayLike in : '" + data.name+"'");
				}					
			
				// LOAD FIELDS
				if(dojo.isArrayLike(data.fields)){
					for (var i = 0; i < data.fields.length; i++) {
						this._field.add(this._getMetaSocket(data.fields[i], cs.model.meta.MetaSocket.MODE_INPUT_FIELD, i));
					}
				} 
				else {
					throw Error("field have to be arrayLike in : '" + data.name+"'");
				}
				
				// LOAD BLOCKS
				if(dojo.isArrayLike(data.blocks)){
					dojo.forEach(data.blocks,function(item){
						this._blocks.add(item);
					},this);
				} else {
					throw Error("Blocks have to be arrayLike in : '" + data.name+"'");
				}				
				
				// set type
				if(this._blocks.size()>0){
					this._type = cs.model.meta.MetaComponent.TYPE_STATEMENT;
				} else if (this._input.size() == 0 && this._field.size() == 1){
					this._type = cs.model.meta.MetaComponent.TYPE_PRIMITIVE;
				} else {
					this._type = cs.model.meta.MetaComponent.TYPE_MODULE;
				}

			} else {
				throw Error("Constructor needs at least a name for the Module");
			}
		},
		
		isStatement : function(){
			return this._type == cs.model.meta.MetaComponent.TYPE_STATEMENT;
		},
		
		isPrimitive : function(){
			return this._type == cs.model.meta.MetaComponent.TYPE_PRIMITIVE;
		},
	
		isModule : function(){
			return this._type == cs.model.meta.MetaComponent.TYPE_MODULE;
		},
		
		isProgram : function(){
			return this._name == "cs.statement.program";
		},
		
		_getMetaSocket : function(a_socket_info,a_mode,a_index){
			if (cs.util.isDojoObject(a_socket_info)&&cs.util.isTypeOf(a_socket_info, "cs.type.Type")) {
				return new cs.model.meta.MetaSocket("", a_socket_info, a_mode, a_index);
			} else {
				return new cs.model.meta.MetaSocket(a_socket_info.name, a_socket_info.type, a_mode, a_index);
			}
		},
		
		/**
		 * Getters
		 */
		getName : function(){return this._name;},
		getDescription : function(){return this._description;},
		getInputs : function(){return this._input;},
		getInput : function(nbr){return this._input.get(nbr);},
		getOutputs: function(){return this._output;},
		getOutput : function(nbr){return this._output.get(nbr);},
	    getFields: function(){return this._field;},
		getField: function(nbr){return this._field.get(nbr);},
		getBlocks : function(){return this._blocks;},
		getBlock : function(nbr){return this._blocks.get(nbr);},
		getImgPath: function(){return this._imgPath;},
		getType: function(){return this._type;},
		getExec: function(){return this._exec;},
		getReset: function(){return this._reset;},
		getView: function(){return this._view;},
		
		/**
		 * has
		 */
		hasView : function(){return this._view != null;},

		/**
		 * 
		 */
		toHTML : function(){
			var out = "";
			out += "<div><span class='csInfoTitle'>name: </span>"+this.getName()+"</div>";
			out += "<div class='csInfoDescription'>" +this.getDescription()+ "</div>";
			out += "<div class='csSockets'><img src='"+cs.config.rootPath+"lib/"+this.getImgPath()+"'/>" +
					"<div><span class='csInfoTitle'>inputs: </span></div>";
			
			infoSocketLine = function(a_socket){
				return "<div class='csSocketLine'>" +
							"<span class='csInfoSocket' style='background-color:"+a_socket.getType().getColor()+"'>i</span>" +
									a_socket.getName()+
						"</div>";				
			};
			
			
			
			if(this.getInputs().size()>0){
			this.getInputs().forEach(function(socket){
				out += infoSocketLine(socket);
			});
			} else {
				out += "<div>&nbsp;&nbsp;-</div>";				
			}
			out += "<div><span class='csInfoTitle'>outputs: </span></div>";
			if(this.getOutputs().size()>0){
			this.getOutputs().forEach(function(socket){
				out += infoSocketLine(socket);
			});
			} else {
				out += "<div>&nbsp;&nbsp;-</div>";				
			}
			out += "<div><span class='csInfoTitle'>fields: </span></div>";
			if(this.getFields().size()>0){
			this.getFields().forEach(function(socket){
				out += infoSocketLine(socket);
			});
			} else {
				out += "<div>&nbsp;&nbsp;-</div>";				
			}
			return out+"</div>";
		}
	});
	
	cs.model.meta.MetaComponent.defaultComponent = {
		name: "",
		description: "",
		inputs: [],
		outputs: [],
		fields: [],
		image: "",
		view: null,
		blocks: []
	};
	
	cs.model.meta.MetaComponent.TYPE_UNDEFINED = "undefined";
	cs.model.meta.MetaComponent.TYPE_MODULE = "module";
	cs.model.meta.MetaComponent.TYPE_PRIMITIVE = "primitive";
	cs.model.meta.MetaComponent.TYPE_STATEMENT = "statement";