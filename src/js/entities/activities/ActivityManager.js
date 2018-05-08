import Activity from './Activity';
import Move from './shared/Move';
import Patrol from './shared/Patrol';
import Follow from './shared/Follow';
import Stop from './shared/Stop';
import Idle from './shared/Idle';
import Fire from './shared/Fire';
import GetInRange from './shared/GetInRange';
import GetToDock from './shared/GetToDock';
import Attack from './shared/Attack';
import Mine from './shared/Mine';
import RotateToTarget from './shared/RotateToTarget';
import Deliver from './shared/Deliver';
import Produce from './shared/Produce';
import CreateIcarus from './custom/CreateIcarus';

const ns = window.fivenations;

/**
 * Static function that returns the Class definition of the
 * Activity with the given name
 */
function getActivityByString(className) {
  return ActivityManager[className];
}

function ActivityManager(entity) {
  let activities = [];

  return {
    /**
     * Adds the given activity to the activity queue
     * @param {object} Activity - An instance that inherits from Activity
     * @param {boolean} addAsLast - Adds the given Activity as the last element
     * of the activity list if true
     */
    add(activity, addAsLast) {
      const l = activities.length;
      const currentIdx = l - 1;
      if (!(activity instanceof Activity)) {
        throw 'You must extend the manager with an object inherits from Activity!';
      }
      // removes the current activiy if it's Idle
      if (!(activity instanceof Idle) && l > 0) {
        if (activities[currentIdx] instanceof Idle) {
          this.removeByIndex(currentIdx);
        }
      }
      // the naming must be confusing but the excecution order of
      // the collection is inverted
      if (addAsLast) {
        activities.unshift(activity);
      } else {
        activities.push(activity);
      }
      activity.setManager(this);
      // activity.activate() function can refer to elements in the
      // activity queue therefore this must be excecuted after
      // this activity is added to the activities collection
      activity.activate();
    },

    remove(activity) {
      for (let i = 0; i < activities.length; i += 1) {
        if (activities[i] === activity) {
          this.removeByIndex(i);
          break;
        }
      }
    },

    removeByIndex(idx) {
      let lastItem;
      if (!activities[idx]) {
        return;
      }
      activities[idx].deactivate();
      activities.splice(idx, 1);
      if (activities.length > 0) {
        lastItem = activities[activities.length - 1];
        lastItem.activate();
      }
    },

    removeAll() {
      activities = [];
    },

    update() {
      if (ns.debugMode) {
        this.debug();
      }
      const l = activities.length;
      const currentIdx = l - 1;
      if (l === 0) {
        // when the activity list is emtpty the entity should go idling
        this.add(new Idle(entity));
        return;
      }
      // excecutes the last function in the queue treating it with priority
      // if it has been activated and it realises the update function
      if (!activities[currentIdx].isActivated()) return;
      if (!activities[currentIdx].update) return;

      activities[currentIdx].update();
    },

    /**
     * Returns true if the current Activity is Idle
     */
    isIdling() {
      const l = activities.length;
      const currentIdx = l - 1;
      return activities[currentIdx] instanceof Idle;
    },

    /**
     * Returns true if the current Activity is Idle
     */
    isProducing() {
      const l = activities.length;
      const currentIdx = l - 1;
      return activities[currentIdx] instanceof Produce;
    },

    /**
     * Display debug information about the activities
     */
    debug() {
      const phaserGame = ns.game.game;
      activities.forEach((activity, idx) => {
        phaserGame.debug.text(
          activity.constructor.name,
          entity.getSprite().x - ns.game.camera.x,
          entity.getSprite().y - ns.game.camera.y + idx * 16,
          '#ffff00',
        );
      });
    },
    /**
     * Returns the currently executed Activity instance
     * @return {object} Activity
     */
    getCurrentActivity() {
      const l = activities.length;
      const currentIdx = l - 1;
      return activities[currentIdx];
    },
  };
}

ActivityManager.Move = Move;
ActivityManager.Stop = Stop;
ActivityManager.Patrol = Patrol;
ActivityManager.Follow = Follow;
ActivityManager.Fire = Fire;
ActivityManager.GetInRange = GetInRange;
ActivityManager.GetToDock = GetToDock;
ActivityManager.Attack = Attack;
ActivityManager.Mine = Mine;
ActivityManager.RotateToTarget = RotateToTarget;
ActivityManager.CreateIcarus = CreateIcarus;
ActivityManager.Deliver = Deliver;
ActivityManager.getActivityByString = getActivityByString;

export default ActivityManager;
