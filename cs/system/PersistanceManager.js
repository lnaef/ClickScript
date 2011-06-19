/**
 * @author elcc
 * 
 * Class cs.system.Serializer 
 * 
 * @description: This is a helper class to serialize an DOM-Element.
 * It also Generates the singleton cs.global.serializer which is a helper for serialisation
 */
	
	dojo.provide("cs.system.PersistanceManager");
	
	dojo.declare("cs.system.PersistanceManager", null, {
		
		/*
		 * DOMAIN of the persistance server
		 */
		_url   : "",
		
		/**
		 * User Accounts
		 * [{username:xyz, token:zyx}]
		 */
		_accounts  : [],
		
		/**
		 * Current Name and Security Token of the user
		 */
		_token : "",
		_username  : "",
		
		/**
		 * loaded scripts the Script-ID is the key in the array
		 */
		_scripts : [],
		
		/**
		 * Loaded script
		 */
		_activeScriptId : 0,
		
		
		
		constructor : function(url, accounts){
			accounts = accounts || [];
			
			this._url   = url;
			this._accounts = accounts;
			if(this._accounts.length>0){
				this.setUser(this._accounts[0].username, this._accounts[0].token);
			}
			
		},
		
		getScript : function(id){
			return this._scripts[id];
		},
		
		getAccounts : function(){
			return this._accounts;
		},
		
		/**
		 * @param function() onCompleteCallback  function gets executed on completed loading, parameter is a array of scripts
		 */
		getScripts : function(onCompleteCallback){
			// todo: move parameters to config
			var url = this._url + "/v1/script.php?action=get&username="+this._username+"&token="+this._token;
			this._scripts = [];
			
			var self = this;
			
	        var jsonpArgs = {
	            url: url,
	            callbackParamName: "callback",
	            load: function(data) {
					if(data.status.code == 1){
						dojo.forEach(data.response, function(script){
							self._scripts[script.id] = script;
						});
						onCompleteCallback(data.response);
					} else {
						cs.console.writeError(data.status.message);
					}
	            },
	            error: function(error) {
	                cs.console.writeError( "An unexpected error occurred on getting scripts from server: " + error);
	            }
	        };
	        dojo.io.script.get(jsonpArgs);
	
		},
		
		/**
		 * Set username and token of the user
		 */
		setUser : function(username, token){
			this._username = username;
			this._token = token;
		},
		
		/**
		 * get a script from the loaded scripts
		 * @param int id   id of the script
		 */
		loadScript : function(id){
			this._activeScriptId = id;
			var script = this._scripts[id];
			cs.global.scriptPlayer.run(script.code);
		},
		
		/**
		 * save current script
		 */
		saveScript : function(code){
			
			if(this._activeScriptId !== 0){

				var url = this._url + "/v1/script.php?action=update&username="+this._username+"&token="+this._token+"&id="+this._activeScriptId;
				
				var self = this;
				
		        var jsonpArgs = {
		            url: url,
		            callbackParamName: "callback",
		            content : {
						code : code
		            },
		            load: function(data) {
						if(data.status.code == 1){
							// script successfully saved
						} else {
							// some error occured
							cs.console.writeError(data.status.message);
						}
		            },
		            error: function(error) {
		                cs.console.writeError( "An unexpected error occurred on saving script: " + error);
		            }
		        };
		        dojo.io.script.get(jsonpArgs);
	        } else {
				cs.console.writeError("No script loaded");
	        }
		},
		
		saveAsScript : function(code,name){

			var url = this._url + "/v1/script.php";
			
			var self = this;
			
	        var jsonpArgs = {
	            url: url,
	            callbackParamName: "callback",
	            content : {
					username    : this._username,
					token       : this._token,
					code        : code,
					script_name : name,
					action      : "insert"
	            },
	            load: function(data) {
					if(data.status.code == 1){
						// script successfully saved
					} else {
						// some error occured
						cs.console.writeError(data.status.message);
					}
	            },
	            error: function(error) {
	                cs.console.writeError( "An unexpected error occurred on saving script: " + error);
	            }
	        };
	        dojo.io.script.get(jsonpArgs);
		},
		
		deleteScript : function(id){

			var url = this._url + "/v1/script.php";
			
			var self = this;
			
	        var jsonpArgs = {
	            url: url,
	            callbackParamName: "callback",
	            content : {
					username : this._username,
					token    : this._token,
					id       : id,
					action   : "delete"
	            },
	            load: function(data) {
					if(data.status.code == 1){
						// script successfully saved
					} else {
						// some error occured
						cs.console.writeError(data.status.message);
					}
	            },
	            error: function(error) {
	                cs.console.writeError( "An unexpected error occurred on saving script: " + error);
	            }
	        };
	        dojo.io.script.get(jsonpArgs);
		}
		
	});
	
	cs.global.persistanceManager = new cs.system.PersistanceManager("http://localhost/clickscript_server/services",cs.config.accounts);

	
	/**
	 * TIP: dojox.xml.DomParser.parse(xml)
	 */


	
