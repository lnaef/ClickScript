/**
 * @author elcc
 */

dojo.provide("cs.lib.robotic.init");

dojo.require("cs.lib.robotic.Util");


	window.roboticUtil = new cs.lib.robotic.Util();

	csComponentContainer.push({
		name : "cs.robotic.red-light",
		description : "Switches red light on if SWITCH is on",
		inputs : 
			[{
				name: "SWITCH",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[],
		image: "robotic/onRedLight.png",
		exec : function(state){
			var input = state.inputs.item(0).getValue();
			if(input){
				state.view.switchOn();
			} else {
				state.view.switchOff();
			}
		},
		view : {
			
			source: "<img src='"+cs.config.rootPath + "lib/robotic/offRedLight.png'/>",
			
			on: "lib/robotic/onRedLight.png",
			
			off: "lib/robotic/offRedLight.png",			
			
			switchOn : function(){
				this.getNode().src = cs.config.rootPath + this.on;
			},
			
			switchOff : function(){
				this.getNode().src = cs.config.rootPath + this.off;
			}
					
		},
		
		reset : function(state){
			state.view.switchOff();
		}
	});
	
	
	csComponentContainer.push({
		name : "cs.robotic.green-light",
		description : "Switches green light on if SWITCH is on",
		inputs : 
			[{
				name: "SWITCH",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[],
		image: "robotic/onGreenLight.png",
		exec : function(state){
			var input = state.inputs.item(0).getValue();
			if(input){
				state.view.switchOn();
			} else {
				state.view.switchOff();
			}
		},
		view : {
			source: "<img src='"+cs.config.rootPath + "lib/robotic/offGreenLight.png'/>",
			on: "lib/robotic/onGreenLight.png",
			off: "lib/robotic/offGreenLight.png",			
			
			switchOn : function(){
				this.getNode().src = cs.config.rootPath + this.on;
			},
			
			switchOff : function(){
				this.getNode().src = cs.config.rootPath + this.off;
			}			
		},
		
		reset : function(state){
			state.view.switchOff();
		}
	});
	
	csComponentContainer.push({
		name : "cs.robotic.blue-light",
		description : "Switches blue light on if SWITCH is on",
		inputs : 
			[{
				name: "SWITCH",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[],
		image: "robotic/onBlueLight.png",
		exec : function(state){
			var input = state.inputs.item(0).getValue();
			if(input){
				state.view.switchOn();
			} else {
				state.view.switchOff();
			}
		},
		view : {
			source: "<img src='"+cs.config.rootPath + "lib/robotic/offBlueLight.png'/>",
			on: "lib/robotic/onBlueLight.png",
			off: "lib/robotic/offBlueLight.png",			
			
			switchOn : function(){
				this.getNode().src = cs.config.rootPath + this.on;
			},
			
			switchOff : function(){
				this.getNode().src = cs.config.rootPath + this.off;
			}			
		},
		
		reset : function(state){
			state.view.switchOff();
		}
	});
	
	csComponentContainer.push({
		name : "cs.robotic.light",
		description : "Switches light on if SWITCH is on",
		inputs : 
			[{
				name: "SWITCH",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[],
		image: "robotic/onYellowLight.png",
		exec : function(state){
			var input = state.inputs.item(0).getValue();
			if(input){
				state.view.switchOn();
			} else {
				state.view.switchOff();
			}
		},
		view : {
			source: "<img src='"+cs.config.rootPath + "lib/robotic/offYellowLight.png'/>",
			on: "lib/robotic/onYellowLight.png",
			off: "lib/robotic/offYellowLight.png",			
			
			switchOn : function(){
				this.getNode().src = cs.config.rootPath + this.on;
			},
			
			switchOff : function(){
				this.getNode().src = cs.config.rootPath + this.off;
			}			
		},
		
		reset : function(state){
			state.view.switchOff();
		}
	});
	
	
	csComponentContainer.push({
		name : "cs.robotic.heizung",
		description : "Diese Heizung heitzt den Raum auf die vorgegebene TEMPERATUR (&deg;C) falls der SCHALTER eingeschalten ist",
		inputs : 
			[{
				name: "SCHALTER",
				type: "cs.type.Boolean"
			},
			{
				name: "TEMPERATUR",
				type: "cs.type.Number"
			}],
		outputs:  
			[],
		image: "robotic/radiator.png",
		exec : function(state){
			if(!this.temperature){this.temperature = roboticUtil.getOffTemperature();}
			roboticUtil.addTemperatureSource(this);
			
			var input = state.inputs.item(0).getValue();
			var temp = state.inputs.item(1).getValue();
			if(input){
				state.view.switchOn();
				if(temp > roboticUtil.getDefaultRoomTemperature()){
					this.temperature = temp;
				} else {
					this.temperature = roboticUtil.getOffTemperature();
				}
			} else {
				state.view.switchOff();
				this.temperature = roboticUtil.getOffTemperature();
			}
		},
		view : {
			source: "<img src='"+cs.config.rootPath + "lib/robotic/radiatorOff.png'/>",
			on: "lib/robotic/radiatorOn.png",
			off: "lib/robotic/radiatorOff.png",					
			switchOn : function(){this.getNode().src = cs.config.rootPath + this.on;},
			switchOff : function(){this.getNode().src = cs.config.rootPath + this.off;}			
		},
		reset : function(state){
			state.view.switchOff();
			this.temperature = roboticUtil.getOffTemperature();
		}
	});
	
	
	csComponentContainer.push({
		name : "cs.robotic.luefter",
		description : "Dieser L&uuml;fter k&uuml;hlt den Raum falls der SCHALTER eingeschalten ist",
		inputs : 
			[{
				name: "SCHALTER",
				type: "cs.type.Boolean"
			}],
		outputs:  
			[],
		image: "robotic/cooler.png",
		exec : function(state){
			if(!this.temperature){this.temperature = roboticUtil.getOffTemperature();}
			roboticUtil.addTemperatureSource(this);
			
			var input = state.inputs.item(0).getValue();
			var temp = 10;
			if(input){
				state.view.switchOn();
				if(temp < roboticUtil.getDefaultRoomTemperature()){
					this.temperature = temp;
				} else {
					this.temperature = roboticUtil.getOffTemperature();
				}
			} else {
				state.view.switchOff();
				this.temperature = roboticUtil.getOffTemperature();
			}
		},
		view : {
			source: "<img src='"+cs.config.rootPath + "lib/robotic/coolerOff.gif'/>",
			on: "lib/robotic/coolerOn.gif",
			off: "lib/robotic/coolerOff.gif",					
			switchOn : function(){
				if(this.getNode().src != cs.config.rootPath + this.on){
					this.getNode().src = cs.config.rootPath + this.on;
				}
			},
			switchOff : function(){this.getNode().src = cs.config.rootPath + this.off;}			
		},
		reset : function(state){
			state.view.switchOff();
			this.temperature = roboticUtil.getOffTemperature();
		}
	});
	
	
	csComponentContainer.push({
		name : "cs.robotic.temperatur",
		description : "Dieses Temperaturmessgerät gibt die Raum - TEMPERATUR an",
		inputs : 
			[],
		outputs:  
			[{
				name: "TEMPERATUR",
				type: "cs.type.Number"
			}],
		image: "robotic/temperatur.png",
		exec : function(state){
			var value = roboticUtil.getTemperature();
			state.view.setValue(value);
			state.outputs.item(0).setValue(value);
		},
		view : {
			source: "<div>" +
					"	<div style='background-image:url("+cs.config.rootPath + "lib/robotic/temperaturBk.png);width:11px;margin:0px auto;'>" +
					"		<div class='tpFg' style='width:11px;height:65px;background-image:url("+cs.config.rootPath + "lib/robotic/temperaturFg.png);background-repeat:no-repeat'></div>" +
					"	</div>" +
					"	<div class='tpLabel' style='font-size:7pt'>0&deg;C</div>" +
					"<div>",
			
			setValue : function(value){
				$(".tpLabel",this.getNode()).html(value + "&deg;C");
				$(".tpFg",this.getNode()).css("background-position","0px -"+value+"px");
				//"background-position: 0px "+Math.floor((height-(height/max)*value))+"px"
			}
		},
		
		reset : function(state){
			state.view.setValue(0);
		}
	});
	
	csComponentContainer.push({
		name: "cs.robotic.switch",
		description: "switch with two states",
		outputs: [{
			name: "checkbox",
			type: "cs.type.Boolean"
		}],
		exec : function(state){
			var value = state.view.getValue();
			state.outputs.item(0).setValue(value);
			
		},
		image: "robotic/switch.png",
		view : {
			// how to prevent changing style on each lamp?
			source : "<input type='checkbox'/>",
			
			getValue : function(){
				return dojo.attr(this.getNode(),"checked");
			}
		}
	});
	
	
	csComponentContainer.push({
		name : "cs.robotic.auto",
		description : "Fährt wenn GESCHWINDIGKEIT eingestellt ist. Hat 4 Geschwindigkeitstufen 0, 1, 2 und 3",
		inputs : 
			[{
				name: "GESCHWINDIGKEIT",
				type: "cs.type.Number"
			}],
		outputs:  
			[],
		image: "robotic/car.png",
		exec : function(state){

			var input = parseInt(state.inputs.item(0).getValue());
			input = input ? input : 0;
			input = input < 4 ? input : 3;
			input = input >= 0 ? input : 0;
			
			if(this._speed != input){
				this._speed = input;
				state.view.drive(input);
			}
		},
		view : {
			source: "<img src='"+cs.config.rootPath + "lib/robotic/car0.gif'/>",	
			
			drive: function(speed){
				switch(speed){
				case 0:
					this.getNode().src = cs.config.rootPath + "lib/robotic/car0.gif";
					break;
				case 1:
					this.getNode().src = cs.config.rootPath + "lib/robotic/car1.gif";
					break;
				case 2:
					this.getNode().src = cs.config.rootPath + "lib/robotic/car2.gif";
					break;
				case 3:
					this.getNode().src = cs.config.rootPath + "lib/robotic/car3.gif";
					break;
				}	
			}
		},
		
		reset : function(state){
			this._speed = 0;
			state.view.drive(0);
		}
	});
	
	
	
	csComponentContainer.push({
		name : "cs.robotic.sound",
		description : "Switches red light on if SWITCH is on. SOUND-NR definds the sound played. 1: car horn, 2: ufo, 3: bandsaw, 4: machine",
		inputs : 
			[{
				name: "SWITCH",
				type: "cs.type.Boolean"
			}],
		outputs: [], 
		fields:	[{
			name: "SOUND-NR",
			type: "cs.type.Number"
		}],
		
		image: "robotic/speaker.png",
		exec : function(state){
			var soundnr = state.fields.item(0).getValue();
			var soundpath = cs.config.rootPath;
			switch(soundnr){
			case "2":
				soundpath += "lib/robotic/sound/ufo.ogg";
				break;
			case "3":
				soundpath += "lib/robotic/sound/bandsaw.ogg";
				break;
			case "4":
				soundpath += "lib/robotic/sound/machine.ogg";
				break;
			default:
				soundpath += "lib/robotic/sound/car_horn.ogg";
			}
				
			if(this._soundpath != soundpath){
				state.view.setSound(soundpath);
				this._soundpath = soundpath;
			}
			var input = state.inputs.item(0).getValue();
			if(input){
				state.view.switchOn();
			} else {
				state.view.switchOff();
			}
		},
		view : {
			
			source: "<div><div style='text-align:center'><img src='"+cs.config.rootPath + "lib/robotic/speakerOff.gif' style='width:50px;height:50px'/></div>" +
					"<audio src='"+cs.config.rootPath + "lib/robotic/sound/car_horn.ogg' >" + //controls attribute to debug
						"Your browser does not support the <code>audio</code> element." +
					"</audio></div>",
			
			on: "lib/robotic/speakerOn.gif",
			
			off: "lib/robotic/speakerOff.gif",			
			
			switchOn : function(){
			   
			var audio = dojo.query("audio",this.getNode())[0];
			
			   if(this._paused || audio.ended){
				   
				   audio.play();
				   dojo.query("img",this.getNode())[0].src = cs.config.rootPath + this.on;
			   }
			   
			   this._paused = false;
			},
			
			switchOff : function(){
				
					dojo.query("audio",this.getNode())[0].pause();
					dojo.query("img",this.getNode())[0].src = cs.config.rootPath + this.off;
				
				this._paused = true;
			},
			
			setSound : function(path){
				var audio = dojo.query("audio",this.getNode())[0];

					audio.src = path;
					audio.load();

			}
					
		},
		
		reset : function(state){
			state.view.switchOff();
		}
	});



