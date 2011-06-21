/**
 * @author elcc
 */
	
	dojo.provide("cs.controller.LibraryController");
	
	dojo.require("cs.model.meta.MetaComponent");
	dojo.require("cs.type.Type");
	dojo.require("cs.model.program.Component");
	dojo.require("cs.model.program.Module");
	dojo.require("cs.util.Map");
	dojo.declare("cs.controller.LibraryController", null, {
		
		/**
		 * All registered MetaComponents
		 */
		_metadataMap : null,
		
		/**
		 * All registered types
		 */
		_typeMap: null,
		
		constructor : function(){
			this._metadataMap = new cs.util.Map();
			this._typeMap = new cs.util.Map();
		},
		
		
		
		/*
		 * ALL ABOUT TYPES
		 */
		/**
		 * Adds a type structure to the library and generates automatically the 
		 * Types for it and its Collection added to the _typeMap
		 * @param {cs.type.Structure|String} a_type_structure
		 */
		addTypeStructure : function (a_type_structure, a_color){
			
			var typeStructure = dojo.isString(a_type_structure) ? new cs.type.Structure(a_type_structure,a_color) : a_type_structure;
			var type = new cs.type.Type(typeStructure,false);
			var name = type.getName();
			
			// add the type to the container
			if (!this.hasType(name)) {
				this._typeMap.put(name,type);
			}
			else {
				throw Error("Type '" + name + "' already registered");
			}
				
			// also add its collection type
			// todo : lazy load
			var typeCollection = new cs.type.Type(typeStructure,true);
			name = typeCollection.getName();
			if (!this.hasType(name)) {
				this._typeMap.put(name,typeCollection);
			}
			else {
				throw Error("CollectionType '" + name + "' already registered");
			}	
		},
		
		/**
		 * Returns reference to the type a_type_name. Returns reference to its Collection in case
		 * of asCollection
		 * 
		 * @param {String} a_type_name
		 * @param {Boolean} asCollection
		 */
		getType : function(a_type_name, asCollection){
			var name = a_type_name;
			if(asCollection){
				name = "Collection<" + name + ">";
			}
			if(this.hasType(name)){
				return this._typeMap.get(name);
			} else {
				throw Error("cs.library.getType() : Type '" + name + "' not registered!");
			}
		}, 
		
		/**
		 * Returns true if a_type_name is already registered
		 * @param {String} a_type_name
		 */
		hasType : function(a_type_name){
			return this._typeMap.has(a_type_name);
		}, 
		
		hasModule : function (a_module_name){
			return this._metadataMap.has(a_module_name) && (this.getMetaComponent(a_module_name).isModule()||this.getMetaComponent(a_module_name).isPrimitive());
		},
		
		hasStatement : function (a_statement_name){
			return this._metadataMap.has(a_statement_name)&& this.getMetaComponent(a_statement_name).isStatement();
		},
		
		
		
		/*
		 * ALL ABOUT MODULES AND STATEMENTS
		 */
		/**
		 * Returns a new statement object of type a_statementTypeName
		 * @param {String} a_statementTypeName
		 */
		getNewStatement : function(a_statementTypeName){
			if (this.hasStatement(a_statementTypeName)) {
				return new cs.model.program.Statement(this._metadataMap.get(a_statementTypeName));
			} else {
				throw Error("cs.library.getNewStatement() : type '" + a_statementTypeName +"' is not loaded");
			}
		},
		
		/**
		 * Returns a new module object of type a_moduleTypeName
		 * @param {String} a_moduleTypeName
		 */
		getNewModule : function(a_moduleTypeName){
			if (this.hasModule(a_moduleTypeName)) {
				return new cs.model.program.Module(this._metadataMap.get(a_moduleTypeName));
			} else {
				throw Error("cs.library.getNewModule() : type'" + a_moduleTypeName + "' is not loaded");
			}
		},
		
		getMetaComponent : function (a_moduleTypeName){
			return this._metadataMap.get(a_moduleTypeName);
		},
		
		/**
		 * Return all registered components ordered by category:
		 * 
		 * cs.string
		 *       concat
		 *       repeat
		 * cs.web.browser
		 *       open
		 *       ...
		 */
		getMetaComponentsByCategory : function(){
			var categories = new cs.util.Map();
			var category = null;
			var cur_cat = "no";
			var cat = "none";
			this._metadataMap.forEach(function(item,key){
				cur_cat = key.substring(0, key.lastIndexOf("."));
				if(cur_cat != cat){
				  cat = cur_cat;
				  if(categories.has(cat)){
					  category = categories.get(cat);
				  } else {
					  var newCategory = new cs.util.Map();
					  category = newCategory;
					  categories.put(cat,category);
				  }
				}
				category.put(key.substring(key.lastIndexOf(".")+1),item);
			});
			return categories;
		},
		

		
		hasMetaComponent : function (a_moduleTypeName){
			return this._metadataMap.has(a_moduleTypeName);
		},
		/**
		 * Adds Module Metadata to the library
		 * @param {cs.model.meta.MetaComponent} a_metacomponent
		 */
		addMetaComponent : function (a_metacomponentData){
			/**
			 * @todo, the user should only type in the strings of types and block names
			 * This function should load the proper Type and MetaBlock objects.
			 * 
			 * > for types done
			 */
			
			if(a_metacomponentData.inputs){
				dojo.forEach(a_metacomponentData.inputs,function(item,i){
					// if there is only a type as string
					if(dojo.isString(item)){
						a_metacomponentData.inputs[i] = {type : this.getType(item), name : "?"};
					} else 
					// if there is a type/name object but type is only string	
					if (dojo.isString(item.type)){
						a_metacomponentData.inputs[i] = {type : this.getType(item.type), name : item.name};
					}
				},this);
			}
			if(a_metacomponentData.outputs){
				dojo.forEach(a_metacomponentData.outputs,function(item,i){
					// if there is only a type as string
					if(dojo.isString(item)){
						a_metacomponentData.outputs[i] = {type : this.getType(item), name : "?"};
					} else 
					// if there is a type/name object but type is only string	
					if (dojo.isString(item.type)){
						a_metacomponentData.outputs[i] = {type : this.getType(item.type), name : item.name};
					}
				},this);
			}
			if(a_metacomponentData.fields){
				dojo.forEach(a_metacomponentData.fields,function(item,i){
					// if there is only a type as string
					if(dojo.isString(item)){
						a_metacomponentData.fields[i] = {type : this.getType(item), name : "?"};
					} else 
					// if there is a type/name object but type is only string	
					if (dojo.isString(item.type)){
						a_metacomponentData.fields[i] = {type : this.getType(item.type), name : item.name};
					}
				},this);
			}
			if(a_metacomponentData.blocks){
				dojo.forEach(a_metacomponentData.blocks,function(item,i){
					// if there is an attribute name, user tried {name : "BLOCKNAME"}
					if(item.name){
						a_metacomponentData.blocks[i] = new cs.model.meta.MetaBlock(item);
					} else 
					// if here is no such attribute user tried new cs.model.meta.MetaBlock({name : "BLOCKNAME"}) 
					if (dojo.isString(item.type)){
						a_metacomponentData.blocks[i] = item;
					}
				},this);
			}
			this._metadataMap.put(a_metacomponentData.name,new cs.model.meta.MetaComponent(a_metacomponentData));
		},
		
		addMetaComponents : function (a_arrayOfMetacomponentData){
			dojo.forEach(a_arrayOfMetacomponentData,function(item){
				this.addMetaComponent(item);
			},this);
		}
		
		
		
		

		
		
		
	});
	
	
	
	
	
	
	
	
	cs.library = new cs.controller.LibraryController();
	

	



	
