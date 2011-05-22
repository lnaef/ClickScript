/**
 * @author elcc
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
			var onoff = state.inputs.item(1).getValue() == "true" ? "on" : "off";
			var component = this;
			
			console.log ("IP:" + ip +" URL:"+ aurl +" STATE:"+ onoff);
			
 			$.ajax({
				  url: aurl,
				  type: "POST",
				  data: ({status : onoff}),
				  success: function(html){
 				 	console.log("successful ajax call for switch");
				    component.finishAsync();
				   
				  },
				  error: function(msg){
					alert("Error on: "+aurl);  
				  }
				});
		},
		reset : function(){
			//alert("reset open");
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
			alert("temp");
			var ip = state.inputs.item(0).getValue();
			//var onoff = state.inputs.item(1).getValue() ? "on" : "off";
			var component = this;
			
 			$.getJSON(
				  "http://"+ip+":8080/AmbientMeter/sensors/temperature/",
				  function(json){
					var temp = json[0].resource.values.main[0];
					console.log(temp);
					state.outputs.item(0).setValue(temp);
				    component.finishAsync();	    
				  }
				);
		},
		reset : function(){
			//alert("reset open");
		}
	});
	
	
	/**
	 * Open a page in an iframe
	 */
	cs.componentContainer.push({
		name : "cs.web.things.smaller_than",
		description : "compare the two values",
		inputs : 
			[
				{
					name: "number1",
					type: "cs.type.Number"
				},
				{
					name: "number2",
					type: "cs.type.Number"
				}
			],
		outputs:  
			[
				{
					name: "first smaller than second?",
					type: "cs.type.Boolean"
				}			
			],
		image: "web/things/smaller.png",
		exec : function(state){
			
			var n1 = state.inputs.item(0).getValue();
			var n2 = state.inputs.item(1).getValue();
			console.log(n1+"*"+n2+"*"+((parseFloat(n1)<parseFloat(n2))?"true":"false"));
			state.outputs.item(0).setValue((parseFloat(n1)<parseFloat(n2))?"true":"false");
		},
		reset : function(){
			//alert("reset open");
		}
	});