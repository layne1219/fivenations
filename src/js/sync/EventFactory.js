import EntityMove from './Entity.Move';
import EntityPatrol from './Entity.Patrol';
import EntityStop from './Entity.Stop';
import EntityCreate from './Entity.Create';
import EntityRemove from './Entity.Remove';
import EntityReset from './Entity.Reset';
import EntityFire from './Entity.Fire';
import EntityAttack from './Entity.Attack';
import EntityGetToDock from './Entity.GetToDock';
import EntityDamage from './Entity.Damage';
import EntityFollow from './Entity.Follow';
import EntityDock from './Entity.Dock';
import EntityUndock from './Entity.Undock';
import EntityPlace from './Entity.Place';
import EntityMine from './Entity.Mine';
import PlayerCreate from './Player.Create';
import PlayerResoureAlter from './Player.Resource.Alter';
import EffectCreate from './Effect.Create';
import EffectRemove from './Effect.Remove';

let singleton;

function createEventFactory() {
  const events = {
    // Entity
    'entity/move': new EntityMove(),
    'entity/patrol': new EntityPatrol(),
    'entity/stop': new EntityStop(),
    'entity/create': new EntityCreate(),
    'entity/remove': new EntityRemove(),
    'entity/reset': new EntityReset(),
    'entity/fire': new EntityFire(),
    'entity/attack': new EntityAttack(),
    'entity/getToDock': new EntityGetToDock(),
    'entity/damage': new EntityDamage(),
    'entity/follow': new EntityFollow(),
    'entity/dock': new EntityDock(),
    'entity/undock': new EntityUndock(),
    'entity/place': new EntityPlace(),
    'entity/mine': new EntityMine(),

    // Player
    'player/create': new PlayerCreate(),
    'player/resource/alter': new PlayerResoureAlter(),

    // Effects
    'effect/create': new EffectCreate(),
    'effect/remove': new EffectRemove(),
  };

  return {
    getEventObjectById(id) {
      if (!id) {
        throw new Error('ID has not been passed to fetch the Event!');
      }
      if (!events[id]) {
        throw new Error('There is no event registered to the given ID!');
      }
      return events[id];
    },
  };
}

export default {
  getInstance() {
    if (!singleton) {
      singleton = createEventFactory();
    }
    return singleton;
  },
};
