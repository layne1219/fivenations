import ControlPage from './ControlPage';

const abilitiesJSON = require('../../assets/datas/common/abilities.json');

class CancelPage extends ControlPage {
  /**
   * Setting up the table of command buttons
   * @return {void}
   */
  populate() {
    const button = this.createControlButton(abilitiesJSON.cancel);
    button.setCoords(0, 0);

    this.addControlButton(button);
  }
}

export default CancelPage;
