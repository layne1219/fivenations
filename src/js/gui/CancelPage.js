import ControlPage from './ControlPage';

class CancelPage extends ControlPage {
  /**
   * Setting up the table of command buttons
   * @return {void}
   */
  populate() {
    const button = this.createControlButton('cancel');
    button.setCoords(0, 0);

    this.addControlButton(button);
  }
}

export default CancelPage;
