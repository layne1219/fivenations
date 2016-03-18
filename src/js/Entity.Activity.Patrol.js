define('Entity.Activity.Patrol', ['Entity.Activity', 'Util'], function(Activity, Util){

	// Private functions
	var 

		/**
		 * Calculate the distance between the start and end point of the line through which 
		 * the entity traverses in patrol mode
		 * @param  {[object]} entity Instance of an Entity class
		 * @return {[void]}
		 */
		calculateDistance = function(entity){
			this.start.distance = Phaser.Math.distance(entity.getSprite().x, entity.getSprite().y, this.start.x, this.start.y);
			this.dest.distance = Phaser.Math.distance(entity.getSprite().x, entity.getSprite().y, this.dest.x, this.dest.y);
		},

		/**
		 * Manage the back and forth nature of moving the entity
		 * @param  {[object]} entity Instance of an Entity class
		 * @return {[void]}
		 */
		moveEntityToPatrolPositions = function(entity){

			if (this.dest.distance < 100 && this.currentTarget === 'dest'){
				entity.moveTo(this.start.x, this.start.y);
				this.currentTarget = 'start';
			} else if (this.start.distance < 100 && this.currentTarget === 'start') {
				entity.moveTo(this.dest.x, this.dest.y);
				this.currentTarget = 'dest';
			}

		};


	/**
	 * Constructor function to PatrolActivity
	 */
	function PatrolActivity(){
		Activity.call(this);
		this.pos = {};
		this.currentTarget = 'dest';
	}

	PatrolActivity.prototype = new Activity;
	PatrolActivity.prototype.constructor = PatrolActivity;

	/**
	 * Updating the activity on every tick
	 * @param  {[object]} entity Instance of an Entity class
	 * @return {[void]}        [
	 */
	PatrolActivity.prototype.update = function(entity){
		if (!this.active){
			return;
		}
		calculateDistance.call(this, entity);
		moveEntityToPatrolPositions.call(this, entity);
	};

	/**
	 * Applying the activity on an entity
	 * @param  {[object]} entity Instance of an Entity class
	 * @return {[void]}
	 */
	PatrolActivity.prototype.activate = function(entity){
		Activity.prototype.activate.call(this);
		if (entity){
			entity.moveTo(this[this.currentTarget].x, this[this.currentTarget].y);
		}
	};

	/**
	 * Persist the start point of the line between the entity will be patroling
	 * @param {[integer]} x Horizontal constituent of the target  
	 * @param {[integer]} y Vertical constituent of the target 
	 */
	PatrolActivity.prototype.setStartPoint = function(x, y){
		this.start.x = x;
		this.start.y = y;
	};

	/**
	 * Persist the end point of the line between the entity will be patroling
	 * @param {[integer]} x Horizontal constituent of the target  
	 * @param {[integer]} y Vertical constituent of the target 
	 */
	PatrolActivity.prototype.setDestionation = function(x, y){
		this.dest.x = x;
		this.dest.y = y;
	};

	return PatrolActivity;

});