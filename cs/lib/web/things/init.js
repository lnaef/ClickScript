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

dojo.provide("cs.lib.web.things.init");



	
	/**
	 * Open a page in an iframe
	 */
	cs.componentContainer.push({
		name : "cs.web.things.switch",
		description : "switch on or off",
		inputs : 
			[
				{
					name: "IP",
					type: "cs.type.String"
				},
				{
					name: "on/off",
					type: "cs.type.Boolean"
				}
			],
		outputs:  
			[
				
			],
		image: "web/things/plogg.png",
		exec : function(state){
			this.setAsync();
			
			var ip = state.inputs.item(0).getValue();
			var aurl = "http://"+ip+":8082/EnergyMonitor/ploggs/Laptop/status.html";
			var onoff = state.inputs.item(1).getValue() ? "on" : "off";
			var component = this;
			
			//console.log ("IP:" + ip +" URL:"+ aurl +" STATE:"+ onoff);
			
			$.ajax({
				  url: aurl,
				  type: "POST",
				  data: ({status : onoff}),
				  success: function(html){
					//console.log("successful ajax call for switch");
				    alert("status of fan : " +onoff);
				    component.finishAsync();  
				  },
				  error: function(msg){
					alert("Error on: "+aurl);  
				  }
				});
		}
	});

	
	/**
	 * Open a page in an iframe
	 */
	cs.componentContainer.push({
		name : "cs.web.things.temperature",
		description : "get the temperature",
		inputs : 
			[
				{
					name: "ip",
					type: "cs.type.String"
				}	
			],
		outputs:  
			[
				{
					name: "temperature",
					type: "cs.type.Number"
				}			
			],
		image: "web/things/temp.png",
		exec : function(state){
			this.setAsync();
			var ip = state.inputs.item(0).getValue();
			var component = this;
			
			$.getJSON(
				  "http://"+ip+":8080/AmbientMeter/sensors/temperature/",
				  function(json){
					var temp = json[0].resource.values.main[0];
					//console.log(temp);
					alert(temp);
					state.outputs.item(0).setValue(temp);
				    component.finishAsync();	    
				  }
				);
		}
	});
	
