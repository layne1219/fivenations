import ProduceButtonLogic from './ProduceButton';
import StopButtonLogic from './StopButton';
import MoveButtonLogic from './MoveButton';
import PatrolButtonLogic from './PatrolButton';
import CancelButtonLogic from './CancelButton';
import AttackButtonLogic from './AttackButton';
import MineButtonLogic from './MineButton';
import FollowButtonLogic from './FollowButton';
import DockButtonLogic from './DockButton';
import UndockButtonLogic from './UndockButton';

const buttonLogics = {};

buttonLogics.produce = ProduceButtonLogic;
buttonLogics.stop = StopButtonLogic;
buttonLogics.move = MoveButtonLogic;
buttonLogics.patrol = PatrolButtonLogic;
buttonLogics.cancel = CancelButtonLogic;
buttonLogics.attack = AttackButtonLogic;
buttonLogics.mining = MineButtonLogic;
buttonLogics.follow = FollowButtonLogic;
buttonLogics.dock = DockButtonLogic;
buttonLogics.undock = UndockButtonLogic;

export default {
  getLogicByControlButton(controlButton) {
    if (!controlButton) {
      throw new Error('invalid ControlButton!');
    }
    return this.getLogicById(controlButton.getId());
  },

  getLogicById(id) {
    if (!buttonLogics[id]) {
      throw new Error('There is no ButtonLogic registered to the given Id');
    }
    return buttonLogics[id];
  },

  getTranslationKeyById(id) {
    const prefix = 'abilities.';
    const keys = Object.keys(buttonLogics);
    for (let i = 0, l = keys.length; i < l; i += 1) {
      if (keys[i] === id) {
        return `${prefix}${keys[i]}`;
      }
    }
    return '';
  },
};
