define('Util', function(){
		
	return {

		/**
		 * Randomize a number between the passed range
		 * @param  {integer} min 
		 * @param  {integer} max 
		 * @return {integer}     
		 */
		rnd: function(min, max){
			return Math.floor(Math.random() * max ) + min;
		},

		/**
		 * between - determine if the passed value is between a certain range 
		 * @param  {integer} value 
		 * @param  {integer} min   
		 * @param  {integer} max  
		 * @return {integer}       
		 */
		between: function(value, min, max){
			return value >= min && value <= max;
		},

		/**
		 * calculateStepTo - Mesasuring how many steps it takes to arrive at the target number by increasing
		 * the current index with step 
		 * @param  {integer} start  
		 * @param  {integer} target 
		 * @param  {integer} max    
		 * @param  {integer} step   
		 * @return {integer}        
		 */
		calculateStepTo: function(start, target, max, step){
			var stepCount = 0;
			while (start !== target && stepCount < max){
				start = (start + step) % max;
				if (start < 0){
					start = max - 1;
				}
				++stepCount;
			}
			return stepCount;
		},

		// Eventlistener object
		EventDispatcher: (function(){

			// Inharitable event dispatcher object
			function EventDispatcher(){
				this.events = {};
			}

			EventDispatcher.prototype.events = {};
			EventDispatcher.prototype.addEventListener = function(type, listener){
				if (!this.events[type]){
					this.events[type] = [];
				}
				this.events[type].push(listener);
				return this;
			};
			EventDispatcher.prototype.removeEventListener = function(type, listener){
				if (!this.events[type]){
					return this;
				}
				var index = this.events[type].indexOf(listener);
				if (!this.events[type][index]){
					return this;
				}
				this.events[type].splice(index, 1);
				return this;
			};
			EventDispatcher.prototype.dispatch = function(type, event){
				if (!this.events[type]){
					return;
				}
				for (var i in this.events[type]){
					if (typeof this.events[type][i] === 'function'){
						this.events[type][i](event);
					} else if (typeof this.events[type][i] === 'object'){
						this.events[type][i][1].call(
							this.events[type][i][0],
							event
						);
					}
				}
			};

			return EventDispatcher;

		})()
	};

});