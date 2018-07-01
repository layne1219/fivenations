/* global Phaser, window */
import ControlPage from './ControlPage';
import ConstructionPage from './ConstructionPage';
import CancelPage from './CancelPage';
import EventEmitter from '../sync/EventEmitter';
import EntityManager from '../entities/EntityManager';

const ns = window.fivenations;

const MAIN_PAGE = 0;
const CONSTRUCTION_PAGE = 1;
const CANCEL_PAGE = 2;

export default class ControlPanel extends Phaser.Group {
  /**
   * Constructing an ControlPanel instance
   * @param {object} entityManager [reference to the singleton instance of EntityManager]
   */
  constructor() {
    super(ns.game.game);
    this.init();
  }

  init() {
    this.entityManager = EntityManager.getInstance();

    // we are creating two pages for all the possible controls
    this.controlPanelPages = {
      [MAIN_PAGE]: this.add(new ControlPage(this.entityManager)),
      [CONSTRUCTION_PAGE]: this.add(new ConstructionPage(this.entityManager)),
      [CANCEL_PAGE]: this.add(new CancelPage(this.entityManager)),
    };
    // make the first page visible
    this.selectMainPage();

    // set up event listeners
    this.setEventListeners();
  }

  /**
   * Displaying the page registered with the passed page Index
   * @param  {integer} pageIdx Index of the page in the containing Array
   * @return {void}
   */
  selectPage(pageIdx) {
    const emitter = EventEmitter.getInstance();
    const keys = Object.keys(this.controlPanelPages);
    for (let i = 0; i < keys.length; i += 1) {
      if (i === pageIdx) {
        this.controlPanelPages[keys[i]].visible = true;
      } else {
        this.controlPanelPages[keys[i]].visible = false;
      }
    }

    this.selectedPageIndex = pageIdx;
    emitter.local.dispatch('gui/controlpanel/change');
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
   * Displaying the main page
   * @return {[viod]}
   */
  selectMainPage() {
    this.selectPage(MAIN_PAGE);
  }

  /**
   * Displaying the secondary page
   * @return {[viod]}
   */
  selectConstructionPage() {
    this.selectPage(CONSTRUCTION_PAGE);
  }

  /**
   * Displaying the cancel page
   * @return {[viod]}
   */
  selectCancelPage() {
    this.selectPage(CANCEL_PAGE);
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
