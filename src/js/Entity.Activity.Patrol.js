define('Entity.Activity.Patrol', ['Entity.Activity'], function(Activity) {

    var MIN_DISTANCE_TO_TARGET = 50,

    /**
     * Calculate the distance between the start and end point of the line through which 
     * the entity traverses in patrol mode
     * @return {[void]}
     */
        calculateDistance = function() {
            this.start.distance = Phaser.Math.distance(this.entity.getSprite().x, this.entity.getSprite().y, this.start.x, this.start.y);
            this.dest.distance = Phaser.Math.distance(this.entity.getSprite().x, this.entity.getSprite().y, this.dest.x, this.dest.y);
        },

        /**
         * Manage the back and forth nature of moving the entity
         * @return {[void]}
         */
        moveEntityToPatrolPositions = function() {

            if (this.dest.distance < MIN_DISTANCE_TO_TARGET && this.currentTarget === 'dest') {
                this.entity.moveTo(this.start.x, this.start.y);
                this.currentTarget = 'start';
            } else if (this.start.distance < MIN_DISTANCE_TO_TARGET && this.currentTarget === 'start') {
                this.entity.moveTo(this.dest.x, this.dest.y);
                this.currentTarget = 'dest';
            }

        };

    /**
     * Constructor function to PatrolActivity
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function PatrolActivity(entity) {
        Activity.call(this);
        this.start = {
            x: 0,
            y: 0
        };
        this.dest = {
            x: 0,
            y: 0
        };
        this.currentTarget = 'dest';
        this.entity = entity;
    }

    PatrolActivity.prototype = new Activity;
    PatrolActivity.prototype.constructor = PatrolActivity;

    /**
     * Updating the activity on every tick
     * @return {[void]}
     */
    PatrolActivity.prototype.update = function() {
        calculateDistance.call(this);
        moveEntityToPatrolPositions.call(this);
    };

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    PatrolActivity.prototype.activate = function() {
        Activity.prototype.activate.call(this);
        if (this.entity) {
            this.entity.moveTo(this[this.currentTarget].x, this[this.currentTarget].y);
        }
    };

    /**
     * Persist the start point of the line between the entity will be patroling
     * @param {[integer]} x Horizontal constituent of the target  
     * @param {[integer]} y Vertical constituent of the target 
     */
    PatrolActivity.prototype.setStartPoint = function(x, y) {
        this.start.x = x;
        this.start.y = y;
    };

    /**
     * Persist the end point of the line between the entity will be patroling
     * @param {[integer]} x Horizontal constituent of the target  
     * @param {[integer]} y Vertical constituent of the target 
     */
    PatrolActivity.prototype.setDestionation = function(x, y) {
        this.dest.x = x;
        this.dest.y = y;
    };

    return PatrolActivity;

});