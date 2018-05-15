/* global Phaser */
import ControlPage from './ControlPage';
import CancelPage from './CancelPage';
import EventEmitter from '../sync/EventEmitter';

export default class ControlPanel extends Phaser.Group {
  /**
   * Constructing an ControlPanel instance
   * @param {object} entityManager [reference to the singleton instance of EntityManager]
   */
  constructor({ entityManager, phaserGame }) {
    super(phaserGame);
    // initialising the pages and buttons
    this.init(entityManager);
  }

  init(entityManager) {
    this.entityManager = entityManager;

    // we are creating two pages for all the possible controls
    this.controlPanelPages = [
      this.add(new ControlPage(this.entityManager)),
      this.add(new ControlPage(this.entityManager)),
      this.add(new CancelPage(this.entityManager)),
    ];
    // make the first page visible
    this.selectMainPage();

    // set up event listeners
    this.setEventListeners();
  }

  /**
   * Displaying the main page
   * @return {[viod]}
   */
  selectMainPage() {
    this.selectPage(0);
  }

  /**
   * Displaying the page registered with the passed page Index
   * @param  {integer} pageIdx Index of the page in the containing Array
   * @return {void}
   */
  selectPage(pageIdx) {
    for (let i = 0; i < this.controlPanelPages.length; i += 1) {
      if (i === pageIdx) {
        this.controlPanelPages[i].visible = true;
      } else {
        this.controlPanelPages[i].visible = false;
      }
    }

    this.selectedPageIndex = pageIdx;
  }

  /**
   * register a listener against changes in the current selection.
   * There is no further need of re-determining what buttons need to be displayed
   * @return {void}
   */
  setEventListeners() {
    const emitter = EventEmitter.getInstance();
    emitter.local.addEventListener(
      'gui/selection/change',
      this.update.bind(this),
    );
    emitter.local.addEventListener(
      'gui/controlpage/update',
      this.update.bind(this),
    );
  }

  /**
   * Appending the ControlPanel to the main Panel element
   * @param  {object} panel [Panel]
   * @param  {integer} x     [horizontal offset of the ControlPanel element on the Panel]
   * @param  {integer} y     [vertical offset of the ControlPanel element on the Panel]
   * @return {void}
   */
  appendTo(panel, x, y) {
    if (!panel) {
      throw new Error('Invalid Phaser.Sprite object!');
    }

    this.x = x;
    this.y = y;
    panel.addChild(this);

    this.panel = panel;
  }

  /**
   * Refresing the graphics objects according to the current values of
   * the exposed abilities of the entity
   * @return {[void]}
   */
  update() {
    const entities = this.entityManager.entities(':selected');

    if (!entities || entities.length === 0) {
      this.hide();
      return;
    }

    this.show();
    if (this.controlPanelPages[this.selectedPageIndex]) {
      this.controlPanelPages[this.selectedPageIndex].update(entities);
    }
  }

  /**
   * Displaying the secondary page
   * @return {[viod]}
   */
  selectSecondaryPage() {
    this.selectPage(1);
  }

  /**
   * Displaying the cancel page
   * @return {[viod]}
   */
  selectCancelPage() {
    this.selectPage(2);
  }

  /**
   * Making the ControlPanel visible
   * @return {[void]}
   */
  show() {
    this.visible = true;
  }

  /**
   * Making the ControlPanel unvisible
   * @return {[void]}
   */
  hide() {
    this.visible = false;
  }

  /**
   * Making the ControlPanel unvisible
   * @return {[void]}
   */
  getEntityManager() {
    return this.entityManager;
  }
}
