define('Entity.MotionManager.EffectManager', function() {

	function EffectManager() {
		this.effects = [];
	}

	EffectManager.prototype = {

		/**
         * Invoking the currently selected effect from the effect queue at every tick
         * @return {[void]}
         */
        updateEffects: function() {
            // invoking the first effect as long as it returns true
            // then remove it  
            while (this.effects[0]) {
                if (!this.effects[0][0].apply(this, this.effects[0].slice(1))) {
                    this.effects.splice(0, 1);
                } else {
                    return false;
                }
            }
        },

        /**
         * Pushing a new effect to the effect queue
         * @param {[function]} effect [function that will be triggered at every tick when selected]
         */
        addEffect: function(effect) {
            var params = Array.prototype.slice(arguments, 1);
            if ('function' !== typeof effect) {
                return false;
            }
            this.effects.push([effect].concat(params));
        },

        /**
         * Reseting the effect queue by removing all the effects from the queue
         * @return {[void]}
         */
        resetEffects: function() {
            for (var i = this.effects.length - 1; i >= 0; i -= 1) {
                this.effects[i] = null;
                this.effects.splice(i, 1);
            }
            this.effects = [];
        },

        /**
         * Removing the given function from the effect queue 
         * @param  {[function]} effect []
         * @return {[void]}}
         */
        removeEffect: function(effect) {
            if ('function' !== effect) {
                return false;
            }
            for (var i = this.effects.length - 1; i >= 0; i -= 1) {
                if (effect === this.effects[i][0]) {
                    this.effects.splice(i, 1);
                }
            }
        }

	};

	
	return EffectManager;

});