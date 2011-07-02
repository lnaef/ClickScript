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
		 * Current Username and Security Token of the user
		 */
		_token : "",
		_username  : "",
		
		/**
		 * loaded scripts the Script-ID is the key in the array
		 * Script ID is unique over all stored scripts on the ClickScript-Server
		 */
		_scripts : [],
		
		/**
		 * Loaded script
		 */
		_activeScriptId : 0,
		
		
		/**
		 * Sets the server url and the given accounts. If available the first account gets selected
		 * Therefore the first users data will be displayed (e.g. script-list in load dialog)
		 * @param url String     Base-Url for the ClickScript-Server
		 * @param accounts Array User Accounts in the format of [{username:xyz, token:zyx}]
		 */
		constructor : function(url, accounts){
			accounts = accounts || [];
			
			this._url   = url;
			this._accounts = accounts;
			
			// set the current user to the first entry in th accounts array
			if(this._accounts.length>0){
				this.setUser(this._accounts[0].username, this._accounts[0].token);
			}
			
		},
		
		/**
		 * @return Returns a script with a given Script-ID
		 * TODO: Check availabilty first
		 */
		getScript : function(id){
			return this._scripts[id];
		},
		
		/**
		 * @return The Accounts-Array with all the loaded users in the format [{username:xyz, token:zyx}]
		 */
		getAccounts : function(){
			return this._accounts;
		},
		
		/**
		 * Loads all scripts of the currently selected user. Use setUser() first to set the user credentials
		 * @param function() onCompleteCallback  function gets executed on completed loading, parameter is a array of scripts
		 */
		getScripts : function(onCompleteCallback){
			// todo: move parameters to config
			var url = this._url + "/v1/script.php?action=get&username="+this._username+"&token="+this._token;
			this._scripts = [];
			
			var self = this;
			
			// Prepare JSONP-Call
	        var jsonpArgs = {
	            url: url,
	            callbackParamName: "callback",
	            load: function(data) {
					if(data.status.code == 1){
						dojo.forEach(data.response, function(script){
							// save the loaded scripts to the _scripts array
							self._scripts[script.id] = script;
						});
						// Fire callback
						onCompleteCallback(data.response);
					} else {
						// an error occured write the message to the console
						cs.console.writeError(data.status.message);
					}
	            },
	            error: function(error) {
					// request got problems -> write to console
	                cs.console.writeError( "An unexpected error occurred on getting scripts from server: " + error);
	            }
	        };
	        
	        // do JSONP - Call
	        dojo.io.script.get(jsonpArgs);
	
		},
		
		/**
		 * Set username and token of the current user
		 * Based on this value, scripts will be retrieved
		 * @param string username   
		 * @param string token      Secret to the current account
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
	cs.global.persistanceManager = new cs.system.PersistanceManager(cs.config.rootServices,cs.config.accounts);
	
	/**
	 * TIP: dojox.xml.DomParser.parse(xml)
	 */


	
