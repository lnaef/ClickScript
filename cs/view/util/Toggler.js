/**
 * @author elcc
 */
	dojo.provide("cs.view.util.Toggler");
	
	dojo.require("dojo.fx");

	dojo.declare("cs.view.util.Toggler", null, {
		
		_rawNode : null,
		_isActive : null,
		_toggler : null,
		
		constructor : function(a_id){
			if(dojo.isString(a_id)){
				this._rawNode = dojo.byId(a_id);
			} else {
				this._rawNode = a_id;
			}
			/*
			this._toggler = new dojo.fx.Toggler({
			       node: this._rawNode,
			       showFunc: dojo.fx.wipeIn,
			       hideFunc: dojo.fx.wipeOut
			});
			*/
			//init toggler
			this._isActive = dojo.style(this._rawNode,"display") == "block";
			/*
			if(this.isActive()){
				this.show();
			} else {
				this.hide();
			}
			*/
		},
		
		show : function(event,a_text){
			//this._toggler.show();
			dojo.style(this._rawNode,"display","block");
			this._isActive = true;
		},
		
		hide : function(){
			//this._toggler.hide();
			dojo.style(this._rawNode,"display","none");
			this._isActive = false;
		},
		
		isActive : function(){
			return this._isActive;
		},
		
		toggle : function(){
			if(this.isActive()){
				this.hide();
			} else {
				this.show();
			}
		}

	});
	

	
