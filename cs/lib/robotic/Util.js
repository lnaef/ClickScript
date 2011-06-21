/**
 * @author elcc
 */
	dojo.provide("cs.lib.robotic.Util");
	dojo.require("dojox.uuid.generateRandomUuid");
	
	dojo.declare("cs.lib.robotic.Util", null, {
		
		_temperature : null,
		_roomTemperature : 20,
		_offTemperature : -9999,
		
		constructor : function(){
			this._temperature = new cs.util.Container();
			dojo.subscribe("worklist/reset", this, "reset");
		},
		
		/**
		 * Calculate the average of all temperature sources which are not set to off
		 */
		getTemperature : function(){
			var temp = this._roomTemperature;
			var counter = 1;
			this._temperature.forEach(function(source){
				if(source.temperature != this._offTemperature){
					temp += source.temperature;
					counter++;
				}
			},this);
			temp = temp / (counter);
			return Math.round(temp*10)/10;
		},
		
		getOffTemperature : function(){
			return this._offTemperature;
		},
		
		getDefaultRoomTemperature : function(){
			return this._roomTemperature;
		},
		
		/**
		 * a_source has to have implemented a temperature attribute!
		 */
		addTemperatureSource : function(a_source){
			if(!this.hasTemperatureSource(a_source)){
				this._temperature.add(a_source);
			}
		},
		
		hasTemperatureSource : function(a_source){
			return this._temperature.has(a_source);
		},
		
		reset : function(){
				this._temperature = new cs.util.Container();
				console.log("Reset: roboticUtil");
		}
		
		
		
 
		
	});
	