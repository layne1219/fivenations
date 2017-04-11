import GetInRange from './GetInRange';
import PlayerManager from '../../players/PlayerManager';
import EventEmitter from '../../sync/EventEmitter';
import Util from '../../common/Util';

/**
 * Constructor function to GetToDock
 * @param  {[object]} entity Instance of an Entity class
 * @return {[object]} 
 */
function GetToDock(entity) {
    GetInRange.call(this, entity);
}

GetToDock.prototype = new GetInRange;
GetToDock.prototype.constructor = GetToDock;

/**
 * Updating the activity on every tick  
 * @return {[void]}
 */
GetToDock.prototype.update = function() {

    var distance;

    if (!this.target) {
        return;
    }

    distance = Util.distanceBetween(this.entity, this.target);

    if (distance <= this.range) {
        this.entity.stop();
        this.emitDockEvent();
        this.kill();
        return;
    }

    // checks whether the target has moved sinec the last check
    if (this.coords.x === this.target.getSprite().x && this.coords.y === this.target.getSprite().y) {
        return;
    } else {
        this.moveTowardsTarget();
    }

};

/**
 * Saving the target entity that will be followed 
 * @return {void}
 */
GetToDock.prototype.setTarget = function(entity) {
    GetInRange.prototype.setTarget.call(this, entity);
    // for optimisation 
    this.range = entity.getDataObject().getWidth() / 2;
}

/**
 * Emits the Universal.Event.Entity.Dock event provided the player is authorised
 * @return {void}
 */ 
GetToDock.prototype.emitDockEvent = function() {
    var authorised = PlayerManager
        .getInstance()
        .getUser()
        .isAuthorised();

    if (!authorised) return;

    EventEmitter
        .getInstance()
        .synced
        .entities(this.entity)
        .dock({
            targetEntity: this.target,
            resetActivityQueue: true
        });
}

export default GetToDock;
