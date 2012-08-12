/**
 * ClickScript - ClickScript is a visual programming language. This is a 
 * data flow programming language running entirely in a web browser.
 * Copyright (C) 2012 Lukas Naef
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * @author lnaef
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
	

	
