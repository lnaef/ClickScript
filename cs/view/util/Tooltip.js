/**
 * @author elcc
 */
	dojo.provide("cs.view.util.Tooltip");

	dojo.declare("cs.view.util.Tooltip", null, {
		
		_rawNode : null,
		_text : null,
		_isOn : null,
		
		constructor : function(){
		// todo toggler for tooltip
			this._rawNode = dojo.place("<div class='csTooltip'></div>",dojo.query("body")[0],"last");
			this.hide();
	},
		
		show : function(event,a_text){
		
				if(a_text){
					this.setText(a_text);
				}
				//place it and show
				dojo.style(this._rawNode,"left",event.pageX+5+"px");
				dojo.style(this._rawNode,"top",event.pageY+5+"px");
				dojo.style(this._rawNode,"opacity",1);
				dojo.style(this._rawNode,"display","block");
				this._isOn = true;
			
		},
		
		hide : function(){
			dojo.style(this._rawNode,"display","none");
			this._isOn = false;
		},
		
		setText : function(a_text){
			this._text = a_text;
			this._rawNode.innerHTML = a_text;
		}, 
		
		getText : function(){
			return this._text;
		},
		
		isOn : function(){
			return this._isOn;
		}

	});
	

	
