import ControlPage from './ControlPage';

const abilitiesJSON = require('../../assets/datas/common/abilities.json');

/**
 * Constructing an a custom CommandPage that consists solely one cancel button
 * @param {object} entityManager - singleton like object that can be used to
 * quiery all the entities]
 * @return {object} ControlPanelPage
 */
function CancelPage(entityManager) {
  // applying the inherited constructor function
  ControlPage.call(this, entityManager);
}

// Making the prototype inherited from Phaser.Group prototype
CancelPage.prototype = Object.create(ControlPage.prototype);
CancelPage.prototype.constructor = CancelPage;

/**
 * Setting up the table of command buttons
 * @return {void}
 */
CancelPage.prototype.populate = () => {
  const button = this.createControlButton(abilitiesJSON.cancel);
  button.setCoords(0, 0);

  this.addControlButton(button);
};

/**
 * Override the original function with a no-op
 * @return {[void]}
 */
CancelPage.prototype.update = () => undefined;

export default CancelPage;
