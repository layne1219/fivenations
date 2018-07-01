/* eslint class-methods-use-this: 0 */
import ControlPage from './ControlPage';

const CANCEL_BUTTON_ID = 'cancel';

class ConstructionPage extends ControlPage {
  /**
   * Createing the ControlButtons and moving them to their right position
   * @return {[void]}
   */
  populate() {
    const buttonCount = this.getButtonCount();
    for (let i = 0; i < buttonCount; i += 1) {
      // last button must be cancelConstructionDisplay
      const id = i === buttonCount - 1 ? CANCEL_BUTTON_ID : null;
      const button = this.createControlButton(id);
      this.addControlButtonAtPosition(button, i);
    }
  }

  /**
   * Updating the page according to the currently selected collection of entities
   * @param {object} entities Array<Entity>
   */
  update(entities) {
    if (!entities) {
      return;
    }
    const entity = entities[0];
    const DO = entity.getDataObject();
    const buttonIds = DO.getConstruction();

    this.resetAllButtons();
    this.showButtonsByConstructionIds(buttonIds);
  }

  /**
   * Sets all button back to the initial state excluding the cancel button
   */
  resetAllButtons() {
    this.buttons.forEach((button) => {
      // cancel button must stay untouched
      if (button.getId() === CANCEL_BUTTON_ID) return;
      button.visible = false;
      button.enable();
    });
  }

  /**
   * Shows the consruction buttons each of which represents a building
   * @param {object} Array<string> - ids - list of entity ids
   * @param {object}
   */
  showButtonsByConstructionIds(ids) {
    ids.forEach((id, idx) => {
      const button = this.buttons[idx];
      if (!button) return;
      button.convertToConstructionButton(id);
      button.visible = true;
    });
  }
}

export default ConstructionPage;
