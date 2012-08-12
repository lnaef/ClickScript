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
	

	
