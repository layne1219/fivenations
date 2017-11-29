import Activity from './Activity';
import Util from '../../common/Util';

const dogFightDistanceTreshold = 100;
const dogFightCoords = [
    {
        x: -0.5,
        y: -0.4
    },
    {
        x: 0.6,
        y: 0
    },
    {
        x: -0.2,
        y: 0.4
    },
    {
        x: -0.6,
        y: 0
    },    
    {
        x: -0.2,
        y: -0.5
    },
    {
        x: 0.5,
        y: -0.4
    },
    {
        x: 0.5,
        y: 0.4
    },
    {
        x: -0.5,
        y: 0.4
    }   
];

class Attack extends Activity {

    /**
     * Generates an Attack activity instance 
     * @param {object} entity - Entity instance
     */
    constructor(entity) {
        super();

        this.entity = entity;
        this.motionManager = entity.getMotionManager();
        this._firstExecution = true;

        // Helper variables for the DogFight logic
        this._dogFight = this.entity.getDataObject().isFighter();
 
        this.onTargetEntityRemove = () => this.kill();
    }

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    activate() {
        super.activate();

        if (!this.target.isTargetable()) {
            this.kill();
        }

        if (this._firstExecution && this.isTargetInRange()) {
            this._firstExecution = false;
            this.entity.stop();
        }

        // -1 means that there is no selected DogFight coordinate just yet
        this._dogFightCoordIdx = -1;

    }

    /**
     * Updates the activity on every tick  
     * @return {[void]}
     */
    update() {

        if (!this.target.isTargetable()) {
            this.kill();
            return;
        }

        if (!this.isTargetInRange()) {
            this.entity.getInRange(this.target);
            return;
        }

        // DogFight logic makes entities to select coordinates
        // around their target entity and move their while the 
        // Attack activity is being executed
        if (this.isDogFightEnabled()) {
            
            // _dogFightCoordIdx === -1 indicates the first execution of
            // the logic whilst we assign a coordinate to the entity
            // straightaway
            if (this._dogFightCoordIdx === -1) {
                this.moveToNextDogFightCoordinate()
            } else {
                
                // otherwise we wait until the coordinate is approached and
                // then assign it
                const distanceToTargetCoords = Util.distanceBetweenEntityAndCoords(this.entity, this._dogFightCoords);
                if (distanceToTargetCoords < dogFightDistanceTreshold) {
                    this.moveToNextDogFightCoordinate()
                }
            }

        } else {

            if (this.motionManager.isMoving()) {
                this.entity.stop();
                return;
            } 

            if (!this.isEntityFacingTarget()) {
                this.entity.rotateToTarget(this.target);
            }

        }

    }

    /**
     * Makes the entity to move to the given coordinate without 
     * registering another activity. That is helpful to implement
     * entity behaviour that requiest the entity to move during the attack
     */
    moveTo(coords) {
        this.coords = coords;
        this.entity.getMotionManager().moveTo(this);
    }

    /**
     * Saving the target entity that will be attacked 
     * @return {[void]}
     */
    setTarget(entity) {
        if (!entity) {
            throw 'Invalid entity is passed to be followed!';
        }

        if (this.target) {
            this.target.off('remove', this.onTargetEntityRemove);
        }

        this.target = entity;
        this.target.on('remove', this.onTargetEntityRemove);
    }

    /**
     * Checks whether the specified target entity is in range 
     * @return {boolean}
     */
    isTargetInRange() {
        var distance;
        var range;

        distance = Util.distanceBetween(this.entity, this.target);
        range = this.entity.getWeaponManager().getMinRange();

        return distance <= range;
    }

    /**
     * Checks whether the specified target entity is facing
     * the given target entity 
     * @return {boolean}
     */
    isEntityFacingTarget() {
        return this.motionManager.isEntityFacingTargetEntity(this.target);
    }

    /**
     * Returns whether the given entity is able to execute 
     * the so called "DogFight" attack style that makes the entity
     * flying around the target while the attack activity is being executed
     * @return {boolean} returns whether the entity is able to DogFight
     */
    isDogFightEnabled() {
        return this._dogFight;
    }


    /**
     * Determines and returns the next DogFight coordinate around 
     * the target entity.
     * @return {object} object containing {x, y} coordinates
     */
    getNextDogFightCoordinate() {
        const targetSprite = this.target.getSprite();
        let offset;

        if (this._dogFightCoordIdx === -1) {
            // uses creation time to simulate randomness
            this._dogFightCoordIdx = this.entity.getCreationTime();
        } else {
            this._dogFightCoordIdx += 1;
        }

        this._dogFightCoordIdx %= dogFightCoords.length;
        offset = dogFightCoords[this._dogFightCoordIdx];

        return {
            x: targetSprite.x + targetSprite.width * offset.x,
            y: targetSprite.y + targetSprite.height * offset.y
        };
    }

    moveToNextDogFightCoordinate() {
        this._dogFightCoords = this.getNextDogFightCoordinate();
        this.entity.getMotionManager().moveTo(this);
    }

    /**
     *  Returns the current target DogFight coordinates
     * @return {object} {x, y}
     */
    getCurrentDogFightCoords() {
        return this._dogFightCoords;
    }

    /**
     * Returns the coordinates to which the entity is heading. It is only
     * used if the entity executes the DogFight logic while attacking
     * @return {object} {x, y}
     */
    getCoords() {
        return this._dogFightCoords;
    }

}

export default Attack;
