/**
 * @author elcc
 */
	dojo.provide("cs.lib.web.browse.Util");
	
	dojo.require("dojox.uuid.generateRandomUuid");
	
 	dojo.declare("cs.lib.web.browse.Util", null, {
 		
 		id : "csWebBrowse",
 		
 		
 		createEmptyFrame : function(a_name, a_node){
 			var name = a_name ? a_name : dojox.uuid.generateRandomUuid();
 			var node = a_node ? a_node : this.getIframeContainer();

 			node.innerHTML += "<iframe id='"+name+"' name='"+name+"'/>";
 			
 			return name;
 		},
 		
 		transformIFrame : function(a_node){
 			var name = dojox.uuid.generateRandomUuid();
 			dojo.attr(a_node,"id",name);
 			dojo.attr(a_node,"name",name);
 			return name;
 		},
 		
 		resetIframe : function(a_name){
 			// on first run, name is not set
 			if(this.getIframe(a_name)){
 				this.getIframe(a_name).src = "";
 			}
 		},
 		
 		getIframe : function(a_name){
 			return document.getElementById(a_name);
 			//return dojo.byId(a_name);
 		},
 	
 		getIframeContainer : function(){
 			if(!dojo.byId(this.id)){
 				dojo.byId("testbench").innerHTML  = dojo.byId("testbench").innerHTML + "<div id='"+this.id+"'></div>";				
 			}
 			return dojo.byId(this.id);
 		},
 		
 		loadIframe : function(a_name,a_url,a_callback_on_loaded){
 			var iframeDoc = this.getIframe(a_name).contentDocument.documentElement;
 			$(this.getIframe(a_name)).one("load",a_callback_on_loaded);
 			this.getIframe(a_name).src = a_url;
 			
 			

			 
 		},
 		
 		deleteIframe : function(a_name){
 			dojo.destroy(this.getIframe(a_name));
 		},
 		
 		openAsyncGET : function(a_url, a_data, a_callback){
 			/*
 			$.get(a_url,null,function (data, textStatus) {
				  alert(data+"*"+textStatus);
				}
			);*/
 			$.ajax({
 				  url: a_url,
 				  type: "GET",
 				  //cache: false, does not work?!,
 				
 				  data : a_data,
 				  success: function(html){
 				    a_callback(html);
 				  }
 				});
 		}
 		
 	});
 	