/**
 * @author elcc
 */
	dojo.provide("cs.view.util.EasyConsole");


	dojo.declare("cs.view.util.EasyConsole", null, {
	
		/**
		 * HTML console node
		 */
		_node : null,
		
		/**
		 * Console text
		 */
		_text : null,
		
		/**
		 * Debug mode on/off
		 */
		_isDebug : false,
	
		constructor : function(a_id,/*optional*/a_style){
			
			this._text = "";
			
			var style = cs.util.makeParameters(cs.view.util.EasyConsole.style,a_style);
			
			// get node for console
			this._node = dojo.byId(a_id);	
			
			// set style
			dojo.style(this._node,style);
		},
		
		/**
		 * Write a_text to console
		 * @param {String} a_text
		 */
		write : function(a_text,a_not_html_encode){
			if(!a_not_html_encode){
				this._text += a_text.replace(/  /g, "&nbsp;&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")+"<br/>";
			} else {
				this._text += a_text.replace(/  /g, "&nbsp;&nbsp;")+"<br/>";	
			}
			this._node.innerHTML = this._text;
		},
		
		/**
		 * Write a_text to console if this.debug is true
		 * @param {String} a_text
		 */
		writeDebug : function(a_text){
			if(this._isDebug){
				this.write(a_text);
			}
		},
		
		
		/**
		 * Write a_text to console as Error
		 * @param {String} a_text
		 */
		writeError : function(a_text){
			var text = "<font color='red' class='errormessage'><strong>/**<br/>&nbsp;* ERROR<br/>&nbsp;**/<br/></strong></font>";
				this.write(text+a_text.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"<br/>",true);
			
		},
		
		
		
		/**
		 * Enable or disable the debug mode
		 */
		setIsDebug : function(b){
			this._isDebug = b;
		},
		
		
		isDebug : function(){
			return this._isDebug;
		},
		
		getNode : function(){
			return this._node;
		}
	});
	
	cs.view.util.EasyConsole.style = {
		fontFamily : "Monospace",
		overflowY : "scroll",
		overflowX : "hidden",
		backgroundColor : "#000",
		color : "#fff",
		display : "block"
	};
	