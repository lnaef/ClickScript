/**
 * @author lnaef
 */
	dojo.provide("cs.util._base");
	/*
	 * TODO : add this to bootstrap
	 */
		
		/**
		 * Return the classname of the object
		 * @param {Object} a_dojoObject
		 */
		cs.util.getClassname = function(a_dojoObject){
			if (cs.util.isDojoObject(a_dojoObject)) {
				return a_dojoObject.declaredClass;
			} else {
				throw Error("No declaredClass defined on: ",a_dojoObject);
			}
		};
		
		cs.util.isDojoObject = function(a_object){
			return (a_object.declaredClass && true);
		};
		
		/**
		 * Tests a_dojoObject if it is of type a_classname
		 * @param {Object or String} a_dojoObject Object to test
		 * @param {Object} a_classname Expected Type
		 */
		cs.util.isTypeOf = function(a_dojoObject,a_classname){
			var classname = a_classname;
			var objectClassname = null;
			if (dojo.isString(a_dojoObject)) {
				objectClassname = a_dojoObject;
			} else {
				objectClassname = cs.util.getClassname(a_dojoObject);
			}
			if(objectClassname == a_classname){
				return true;
			}
			
			// may be a superclass is type of?
			if(!cs.util.hasSuperclass(objectClassname)){
				return false;
			} else {
				var result = false;
				
				// check each superclass object
				cs.util.getSuperclasses(objectClassname);
				dojo.forEach(cs.util.getSuperclasses(objectClassname),function(item){
					result = result || cs.util.isTypeOf(item,classname);
				});
				return result;
			}
		};
		
		/**
		 * True if a_dojoObjectPath has any superclass
		 * @param {Object} a_dojoObjectPath
		 */
		cs.util.hasSuperclass = function(a_dojoObjectPath){
			if(!dojo.isString(a_dojoObjectPath)){throw Error("Input of hasSuperclass has to be a String!");}
			return cs.util.getClassDefinition(a_dojoObjectPath) && cs.util.getClassDefinition(a_dojoObjectPath).superclass;
		};
		
		
		/**
		 * todo fixme : what happens if we have more than one superclass?
		 * @param {Object} a_dojoObjectPath
		 */
		cs.util.getSuperclasses = function(a_dojoObjectPath){
			if(!dojo.isString(a_dojoObjectPath)){throw Error("Input of getSuperclasses has to be a String!");}
			var superclasses = [];
			
			superclasses.push(cs.util.getClassname(cs.util.getClassDefinition(a_dojoObjectPath).superclass));
			/*
			 * if there is multiple inheritence the two classes got concatenated! cs.c inherits from cs.a and cs.b so
			 * cs.c.superclass = "cs.a_cs.b" we can't split on '_' if '_' is allowed as classname character
			 */
			return superclasses;
		};
		
		/**
		 * Returns the Class definition Object
		 * @param {String} a_dojoObjectPath
		 */
		cs.util.getClassDefinition = function(a_dojoObjectPath){
			if(!dojo.isString(a_dojoObjectPath)){throw Error("Input of getClassDefinition has to be a String!");}
			return dojo.getObject(a_dojoObjectPath);
		};
		
		
		cs.util.makeParameters = function(defaults, update){
		//	summary:
		//		copies the original object, and all copied properties from the
		//		"update" object
		//	defaults: Object
		//		the object to be cloned before updating
		//	update:   Object
		//		the object, which properties are to be cloned during updating
		if(!update){
			// return dojo.clone(defaults);
			return dojo.delegate(defaults);
		}
		var result = {};
		for(var i in defaults){
			if(!(i in result)){
				result[i] = dojo.clone((i in update) ? update[i] : defaults[i]);
			}
		}
		return result; // Object
	};
	
	cs.util.smartMakeParameters = function(defaults,values){
		for(var d in defaults){
			if(!values[d]){
				values[d] = defaults[d];
			}
		}
		return values;
	};
