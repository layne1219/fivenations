import Activity from './Activity';
import Util from '../../common/Util';

const dogFightCoords = [
    {
        x: -0.5,
        y: -0.5
    },
    {
        x: 0.5,
        y: -0.5
    },
    {
        x: 0.5,
        y: 0.5
    },
    {
        x: -0.5,
        y: 0.5
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
        this._dogFight = this.entity.getDataObject().isFighter();
        this._dogFightCoordIdx = 0;

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

        if (this.isDogFightEnabled()) {


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

}

export default Attack;
