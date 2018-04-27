/* global window */
/* eslint class-methods-use-this: 0 */
import Event from './Event';

const ns = window.fivenations;

class EntityCargoAlter extends Event {
  /**
   * Executes the event based on the given paramater object
   * @param {object} options - {targtes: [array] of GUIDs of entities}
   */
  execute(options) {
    if (!options.targets || !options.data) {
      return;
    }
    options.targets.forEach((id) => {
      const entity = ns.game.entityManager.entities(id);
      const dataObject = entity.getDataObject();
      const {
        titanium, silicium, uranium, damage,
      } = options.data;

      if (undefined !== titanium) dataObject.setCargoTitanium(titanium);
      if (undefined !== silicium) dataObject.setCargoSilicium(silicium);
      if (undefined !== uranium) dataObject.setCargoUranium(uranium);

      if (damage) {
        entity.damage({
          damage,
          ignoreArmor: true,
        });
      }

      entity.dispatch('updateCargo');
    });
  }
}

export default EntityCargoAlter;
