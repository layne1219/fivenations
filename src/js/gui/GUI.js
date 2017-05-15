import Selector from './Selector';
import EnergyShield from './EnergyShield';
import ColorIndicator from './ColorIndicator';
import StatusDisplay from './StatusDisplay';
import Panel from './Panel';
import Minimap from './Minimap';
import ControlPanel from './ControlPanel';
import Util from '../common/Util';

const guiJSON = require('../../assets/datas/common/gui.json'); 
const ns = window.fivenations;
const entityIcons = guiJSON.icons;
const animations = {
    'click-move': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    'click-enemy': [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    'click-friendly': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
};

let phaserGame;
let entityManager;
let playerManager;
let map;
let userPointer;
let singleton;

/**
 * Returns a map of icons with keys set as the sprite key of the icons
 * @param {object} container Container into which the sprites will be added
 * @return {object} map of sprites
 */
const createIconSprites = function(container) {
    var sprites = {
            'gui.icons.fed': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.fed')),
            'gui.icons.ath': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.ath')),
            'gui.icons.syl': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.syl')),
            'gui.icons.tho': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.tho')),
            'gui.icons.obj': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.obj'))
        },
        each = function(callback) {
            Object.keys(sprites).forEach(function(key) {
                callback.call(container, sprites[key]);
            });
        },
        last;

    each(function(sprite) {
        sprite.visible = false;
    });

    return {
        move: function(x, y) {
            each(function(sprite) {
                sprite.x = x;
                sprite.y = y;
            });
        },
        show: function(key, frame) {
            if (last) {
                if (last !== sprites[key]) {
                    last.visible = false;
                }
            }
            sprites[key].visible = true;
            if (frame) {
                sprites[key].frame = frame;
            }
            last = sprites[key];
        },
        hide: function() {
            if (last) {
                last.visible = false;
            } else {
                each(function(sprite) {
                    sprite.visible = false;
                });
            }
        },
        click: function(callback, ctx) {
            each(function(sprite) {
                sprite.inputEnabled = true;
                sprite.events.onInputDown.add(callback, ctx);
            });
        }
    }
};

// --------------------------------------------------------------------------------------
// EntityDetailsDisplay for Entities
// --------------------------------------------------------------------------------------
const EntityDetailsDisplay = (function() {

    /**
     * Constructing an EntityDetailsDisplay instance
     * @param {object} entityManager [reference to the singleton instance of EntityManager]
     */
    function F(entityManager) {

        // creating the group for the individual StatusBar objects
        this.group = phaserGame.add.group();
        this.group.visible = false;

        // storing the entity manager locally
        this.entityManager = entityManager;

        // setting up the text group
        this.attributeGroup = createAttributeGroup(0, 0, phaserGame);

        // setting up the group for the icons showing up when it comes to multiselection
        this.multiselectionGroup = createMultiselectionGroup(0, 5, phaserGame, this.entityManager);

        this.group.add(this.attributeGroup);
        this.group.add(this.multiselectionGroup);
    }

    // @TODO Refactor this ASAP since it's unarguably a code smell
    function createAttributeGroup(x, y, phaserGame) {

        var container,
            mainAttributeGroup,
            weaponGroup,
            weaponGroupPopup,
            text = {
                marginLeft: 132,
                marginTop: 5,
                titleFont: '12px BerlinSansFB-Reg',
                defaultFont: '11px BerlinSansFB-Reg',
                color: '#77C7D2'
            },
            WEAPON_NUMBER = 12,
            POPUP_PADDING_X = 20,
            POPUP_PADDING_Y = 0;

        /**
         * Main attribute component
         */
        function MainAttributeGroup() {

            Phaser.Group.call(this, phaserGame);

            // creating a Phaser.Sprite object for the entity icons
            this.iconSprites = createIconSprites(this);

            // Text objects to display entity attributes
            this.nameElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop, '', {
                font: text.titleFont,
                fill: text.color
            }));
            this.nicknameElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop + 12, '', {
                font: text.titleFont,
                fill: '#FFFFFF'
            }));
            this.rankElm = null;
            this.hullElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop + 36, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.shieldElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop + 47, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.armorElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop + 58, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.powerElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop + 69, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.hangarElm = this.add(phaserGame.add.text(text.marginLeft, text.marginTop + 80, '', {
                font: text.defaultFont,
                fill: text.color
            }));

        }

        MainAttributeGroup.prototype = Object.create(Phaser.Group.prototype);
        MainAttributeGroup.prototype.constructor = MainAttributeGroup;

        /**
         * Updating the attributes text group as per the passed dataObject
         * @param  {object} entity [Entity instance]
         * @return {void}
         */
        MainAttributeGroup.prototype.updateContent = function(entity) {

            var dataObject = entity.getDataObject();

            if (!dataObject) {
                throw 'Invalid DataObject has been passed!';
            }

            this.iconSprites.show(entityIcons[dataObject.getId()].spriteId, entityIcons[dataObject.getId()].faceFrame);

            // Names
            this.nameElm.text = dataObject.getName();
            this.nicknameElm.text = dataObject.getType();

            // Hull
            var hullTitle = 'Hull: ',
                hullValue = dataObject.getHull(),
                hullMaxValue = '/' + dataObject.getMaxHull(),
                hullColor = Util.getColorFromRatio(dataObject.getHull() / dataObject.getMaxHull(), 'hex');

            this.hullElm.text = hullTitle + hullValue + hullMaxValue;
            this.hullElm.addColor(hullColor, hullTitle.length);

            // Shield
            var shieldTitle = 'Shield: ',
                shieldValue = dataObject.getShield(),
                shieldMaxValue = '/' + dataObject.getMaxShield();

            this.shieldElm.text = shieldTitle + shieldValue + shieldMaxValue;
            this.shieldElm.addColor('#475D86', shieldTitle.length);

            // Armor
            var armorTitle = 'Armor: ',
                armorValue = dataObject.getArmor();

            this.armorElm.text = armorTitle + armorValue;
            this.armorElm.addColor('#FFFFFF', armorTitle.length);

            // Power
            var powerTitle = 'Power: ',
                powerValue = dataObject.getPower(),
                powerMaxValue = '/' + dataObject.getMaxPower();

            this.powerElm.text = powerTitle + powerValue + powerMaxValue;
            this.powerElm.addColor('#FFFFFF', powerTitle.length);

            // Hangar
            var hangarTitle = 'Hangar: ',
                hangarValue = entity.getNumberOfDockerEntities(),
                hangarMaxValue = '/' + dataObject.getMaxHangar();

            this.hangarElm.text = hangarTitle + hangarValue + hangarMaxValue;
            this.hangarElm.addColor('#FFFFFF', hangarTitle.length);

        };

        function WeaponGroup() {
            var weaponText, i, x, y;

            Phaser.Group.call(this, phaserGame);

            this.weaponTexts = [];

            for (i = 0; i < WEAPON_NUMBER; i += 1) {
                x = text.marginLeft + Math.floor(i / 8) * 100;
                y = text.marginTop + (i % 8 + 1) * 11;
                weaponText = this.add(phaserGame.add.text(x, y, '', {
                    font: text.defaultFont,
                    fill: text.color
                }));
                this.weaponTexts.push(weaponText);
                weaponText.inputEnabled = true;
                weaponText.events.onInputOver.add(over, this);
                weaponText.events.onInputOut.add(out, this);
            }

            function over(item) {
                this.dispatcher.dispatch('over', item);
                item.alpha=.5;
            }
            function out(item) {
                /*console.log(item.weapon);
                this.weaponPopup.visible = false;*/
                this.dispatcher.dispatch('out', item);
                item.alpha=1;
            }                    
        }

        WeaponGroup.prototype = Object.create(Phaser.Group.prototype);
        WeaponGroup.prototype.constructor = WeaponGroup;
        WeaponGroup.prototype.dispatcher = new Util.EventDispatcher();

        /**
         * Registers event listener to the given event
         * @param  {string}   event    [the given event]
         * @param  {Function} callback [the callback to be registered]
         * @return {void}
         */
        WeaponGroup.prototype.on = function(event, callback){
            this.dispatcher.addEventListener(event, callback);
        }

        /**
         * Updating the attributes text group as per the passed dataObject
         * @param  {object} entity [Entity]
         * @return {void}
         */
        WeaponGroup.prototype.updateContent = function(entity) {

            if (!entity) {
                throw 'Invalid Entity instance has been passed!';
            }

            for (var i = WEAPON_NUMBER - 1; i >= 0; i -= 1) {
                this.weaponTexts[i].visible = false;
            }

            var weaponManager = entity.getWeaponManager();
            weaponManager.getWeapons().forEach(function(weapon, idx){
                if (!this.weaponTexts[idx]){
                    return;
                }
                this.weaponTexts[idx].weapon = weapon;
                this.weaponTexts[idx].text = weapon.getName();
                this.weaponTexts[idx].visible = true;
            }.bind(this));

        };

        function WeaponGroupPopup(){

            Phaser.Group.call(this, phaserGame);

            this.setDefaultVisiblity();
            this.initBackgroundSprite();
            this.initTextComponents();
        }

        WeaponGroupPopup.prototype = Object.create(Phaser.Group.prototype);
        WeaponGroupPopup.prototype.constructor = WeaponGroupPopup;               

        WeaponGroupPopup.prototype.setDefaultVisiblity = function(){
            this.visible = false;
        }

        WeaponGroupPopup.prototype.initBackgroundSprite = function(){
            this.background = phaserGame.add.sprite(0, 0, 'gui');
            this.background.frame = 115;
            this.add(this.background);
        }

        WeaponGroupPopup.prototype.initTextComponents = function(){
            var marginLeft = 20,
                marginTop = 15;

            this.nameElm = this.add(phaserGame.add.text(marginLeft, marginTop, '', {
                font: text.titleFont,
                fill: text.color
            }));
            this.levelElm = this.add(phaserGame.add.text(marginLeft, marginTop + 11, '', {
                font: text.titleFont,
                fill: text.color
            }));
            this.hullElm = this.add(phaserGame.add.text(marginLeft, marginTop + 24, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.shieldElm = this.add(phaserGame.add.text(marginLeft, marginTop + 35, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.rangeElm = this.add(phaserGame.add.text(marginLeft, marginTop + 46, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            this.descriptionElm = this.add(phaserGame.add.text(marginLeft, marginTop + 57, '', {
                font: text.defaultFont,
                fill: text.color
            }));
        };

        WeaponGroupPopup.prototype.updateContent = function(weapon){

            var title, value, upgradedValue, output;

            // Name
            this.nameElm.text = weapon.getName();

            // Level
            this.levelElm.text = 'Level 0';
            this.levelElm.addColor('#FFFFFF', 0);

            // Damage to Hull
            title = 'DMG to Hull: ';
            value = weapon.getDamage();
            upgradedValue = weapon.getCurrentLevel() * weapon.getUpgradeLevel();

            output = value && (' + ' + upgradedValue) || '';

            this.hullElm.text = title + value + output;
            this.hullElm.addColor('#00FF00', title.length);
            this.hullElm.addColor('#FFFFFF', title.length + value.toString().length + 1);

            // Damage to Shield
            title = 'DMG to Shield: ';
            value = weapon.getDamageShield();
            output = value && (' + ' + upgradedValue) || '';

            this.shieldElm.text = title + value + output;
            this.shieldElm.addColor('#475D86', title.length);
            this.shieldElm.addColor('#FFFFFF', title.length + value.toString().length + 1);

            // Range
            title = 'Range: ';
            value = weapon.getRange();

            this.rangeElm.text = title + value;
            this.rangeElm.addColor('#FFFFFF', title.length);                                   
        };

        container = phaserGame.add.group();

        mainAttributeGroup = new MainAttributeGroup();
        mainAttributeGroup.x = x;
        mainAttributeGroup.y = y;

        weaponGroup = new WeaponGroup();
        weaponGroup.x = x + 100;
        weaponGroup.y = y - 10;

        weaponGroupPopup = new WeaponGroupPopup();

        weaponGroup.add(weaponGroupPopup);
        weaponGroup.on('over', function(item){
            weaponGroupPopup.x = item.x + POPUP_PADDING_X;
            weaponGroupPopup.y = item.y - weaponGroupPopup.height + POPUP_PADDING_Y;
            weaponGroupPopup.visible = true;
            weaponGroupPopup.updateContent(item.weapon);
        });
        weaponGroup.on('out', function(){
            weaponGroupPopup.visible = false;
        });

        container.add(mainAttributeGroup);
        container.add(weaponGroup);


        return container;

    }


    function createMultiselectionGroup(x, y, phaserGame, entityManager) {

        var group,
            iconWidth = 51,
            iconHeight = 51,
            margin = 1,
            columns = 11,
            rows = 2,
            statusBarHeight = 3,
            statusBarMargin = 2;

        function MultiselectionGroup() {
            var args = [].slice.call(arguments),
                createClickListener = function(idx) {
                    return function() {
                        entityManager.unselectAll(this.entities[idx]);
                    };
                },
                i, x, y;

            Phaser.Group.apply(this, args);

            this.entities = [];
            this.icons = [];
            this.healthBar = [];
            this.shieldBar = [];

            for (i = columns * rows - 1; i >= 0; i -= 1) {

                x = i % columns * (iconWidth + margin);
                y = Math.floor(i / columns) * (iconHeight + margin);

                // StatusBars
                this.healthBar[i] = this.add(phaserGame.add.graphics(x + statusBarMargin, y + iconHeight - statusBarHeight - statusBarMargin));
                this.shieldBar[i] = this.add(phaserGame.add.graphics(x + statusBarMargin, y + iconHeight - statusBarHeight * 2 - statusBarMargin - 1));

                // Icons
                this.icons[i] = createIconSprites(this);
                this.icons[i].move(x, y);
                this.icons[i].click(createClickListener(i), this);
            }

        }

        MultiselectionGroup.prototype = Object.create(Phaser.Group.prototype);
        MultiselectionGroup.prototype.constructor = MultiselectionGroup;

        /**
         * Updating the list of selected units
         * @param  {array} entities [Collection of Entity instances]
         * @return {void}
         */
        MultiselectionGroup.prototype.updateContent = function(entities) {

            var dataObject,
                i;

            if (!entities) {
                throw 'Invalid Array of Entity instances has been passed!';
            }

            for (i = this.icons.length - 1; i >= 0; i -=1 ) {
                // if the slot needs to be shown
                if (i < entities.length && entities[i]) {

                    dataObject = entities[i].getDataObject();

                    this.entities[i] = entities[i];

                    this.icons[i].show(entityIcons[dataObject.getId()].spriteId, entityIcons[dataObject.getId()].iconFrame);

                    this.renderBar(this.healthBar[i], dataObject.getHull() / dataObject.getMaxHull());
                    if (dataObject.getMaxShield() > 0) {
                        this.renderBar(this.shieldBar[i], dataObject.getShield() / dataObject.getMaxShield(), '0x475D86');
                    }

                } else {

                    this.entities[i] = null;
                    this.shieldBar[i].visible = false;
                    this.healthBar[i].visible = false;
                    this.icons[i].hide();

                }
            }

        };

        MultiselectionGroup.prototype.renderBar = function(graphics, ratio, color) {
            graphics.visible = true;
            graphics.clear();
            graphics.beginFill(color || Util.getColorFromRatio(ratio));
            graphics.drawRect(0, 0, Math.floor(iconWidth * ratio) - statusBarMargin * 2, statusBarHeight);
            graphics.endFill();
        };

        group = new MultiselectionGroup(phaserGame);
        group.x = x;
        group.y = y;

        return group;

    }

    F.prototype = {

        iconSprites: null,
        group: null,
        panel: null,

        /**
         * Attach the Minimap object to the main GUI Panel
         * @param {object} panel Phaser.Sprite
         * @param {integer} x Horizontal offset from the parent's anchor point 
         * @param {integer} y Vertical offset from the parent's anchor point 
         */
        appendTo: function(panel, x, y) {

            if (!panel) {
                throw 'Invalid Phaser.Sprite object!';
            }

            this.group.x = x;
            this.group.y = y;
            panel.addChild(this.group);

            this.panel = panel;
        },

        /**
         * Refresing the graphics objects according to the current values of 
         * the exposed abilities of the entity
         * @return {[void]}
         */
        update: function() {

            var entities = this.entityManager.entities(':selected');

            if (entities.length === 1) {

                // show the panel for single selection
                this.show();
                this.displaySingleEntityScene(entities[0]);

            } else if (entities.length > 1) {

                // show the panel for multiple selection
                this.show();
                this.displayMultipleEntityScene(entities);

            } else {
                this.hide();
            }

        },

        /**
         * Displaying the GUI elements for the single selection screen
         * @return {object} entity Entity
         */
        displaySingleEntityScene: function(entity) {

            this.attributeGroup.visible = true;
            this.multiselectionGroup.visible = false;

            // Updating the texts + splash icon
            for (var i = this.attributeGroup.children.length - 1; i >= 0; i -= 1) {
                //@TODO Phaser.Group.prototype.update.call(this);
                this.attributeGroup.children[i].updateContent(entity);
            }
        },

        /**
         * Displaying the GUI elements for the multi selection screen
         * @return {array} entities Array of Entity instances
         */
        displayMultipleEntityScene: function(entities) {
            // toggle between the single and multiselection panel
            this.attributeGroup.visible = false;
            this.multiselectionGroup.visible = true;

            // updating the list of the selected entities
            this.multiselectionGroup.updateContent(entities);

        },

        /**
         * Making the StatusDisplay visible
         * @return {[void]}
         */
        show: function() {
            this.group.visible = true;
        },

        /**
         * Making the StatusDisplay unvisible
         * @return {[void]}
         */
        hide: function() {
            this.group.visible = false;
        }

    };

    return F;

})();

const ResourceDisplay = (function() {

    function ResourceGroup(config){
        Phaser.Group.call(this, phaserGame);
        this.initTextComponents(config);
    }

    ResourceGroup.prototype = Object.create(Phaser.Group.prototype);
    ResourceGroup.prototype.constructor = ResourceGroup;

    ResourceGroup.prototype.initTextComponents = function(config){
        var style = {
            font: '11px BerlinSansFB-Reg',
            fill: '#FFFFFF',
            boundsAlignH: 'center'
        };
        if (!config) config = {};
        this.textGroup = this.add(phaserGame.add.text(config.x || 0, config.y || 0, '', style));
        this.textGroup.setTextBounds(0, 0, 60, 15);
    };

    ResourceGroup.prototype.updateContent = function(values){
        var current, max;
        if (!values) values = {};

        current = values.current || 0;
        max = values.max;

        this.textGroup.text = current;
        if (max) { 
            this.textGroup.text += '/' + max;
        }
        this.textGroup.addColor('#FFFFFF', 0);
        this.textGroup.addColor('#475D86', current.toString().length + 1);
    };

    /**
     * Constructor
     * @param {object} playerManager [reference to the singleton instance of PlayerManager]
     */
    function ResourceDisplay(playerManager) {
        Phaser.Group.call(this, phaserGame);
        this.setPlayerManager(playerManager);
        this.initTextElements();
        this.registerEventListeners();
    }

    // Making the prototype inherited from Phaser.Group prototype
    ResourceDisplay.prototype = Object.create(Phaser.Group.prototype);
    ResourceDisplay.prototype.constructor = ResourceDisplay;

    ResourceDisplay.prototype.setPlayerManager = function(playerManager) {
        this.playerManager = playerManager;
    };

    ResourceDisplay.prototype.initTextElements = function(){
        this.titanium = new ResourceGroup({x: 0, y: 0});
        this.add(this.titanium);

        this.silicium = new ResourceGroup({x: 76, y: 0});
        this.add(this.silicium);

        this.energy = new ResourceGroup({x: 152, y: 0});
        this.add(this.energy);

        this.uranium = new ResourceGroup({x: 228, y: 0});
        this.add(this.uranium);

        this.food = new ResourceGroup({x: 304, y: 0});
        this.add(this.food);
    };

    ResourceDisplay.prototype.registerEventListeners = function() {
        ns.game.signals.onPlayerResourcesUpdate.add(this.updateContent, this);
    };

    ResourceDisplay.prototype.updateContent = function() {
        var user = this.playerManager.getUser();
        this.titanium.updateContent({ current: user.getTitanium() });
        this.silicium.updateContent({ current: user.getSilicium() });
        this.energy.updateContent({ current: user.getEnergy() });
        this.uranium.updateContent({ current: user.getUranium() });
        this.food.updateContent({ current: user.getCurrentEntityNumber() });
    };

    /**
     * Appends the ResourceDisplay to the main Panel element
     * @param  {object} panel [Panel]
     * @param  {integer} x [horizontal offset of the ControlPanel element on the Panel]
     * @param  {integer} y [vertical offset of the ControlPanel element on the Panel]
     * @return {void}
     */
    ResourceDisplay.prototype.appendTo = function(panel, x, y) {

        if (!panel) {
            throw 'Invalid Phaser.Sprite object!';
        }

        this.x = x;
        this.y = y;
        panel.addChild(this);

        this.panel = panel;
    };

    return ResourceDisplay;

})();


// =============================================================================================
// 											GUI object 
// =============================================================================================

// Frame rate for the click animations
const CLICK_ANIM_FRAMERATE = 20;

// reference to a Phaser.Group object that incorporate all the GUI elements
let group;

// reference to the Phaser.Image represents the basic panel element
let panel;

// reference to the Minimap object 
let minimap;

// DataObjectProjector
let entityDetailsDisplay;

// reference to the ControlPanel object
let controlPanel;

// reference to the ResourceDisplay object
let resourceDisplay;

// reference to a Phaser.Sprite object that displays the click animation
let clickAnim;

function GUI() {

    initPhaserGroup();
    initClickAnimations();

    // initialise the panel according to which element it should conceal
    initGUIDisplayElements();
}

function initPhaserGroup() {
    group = phaserGame.add.group();
    phaserGame.world.bringToTop(group);
}

/**
 * Initialise the sprite object and link all the animations
 * @return {void}
 */
function initClickAnimations() {
    var anim;
    clickAnim = phaserGame.add.image(0, 0, 'gui');
    clickAnim.visible = false;
    clickAnim.anchor.setTo(0.5, 0.5);

    ['click-move', 'click-enemy', 'click-friendly'].forEach(function(animation) {

        anim = clickAnim.animations.add(animation, animations[animation]);
        anim.onStart.add(function() {
            this.visible = true;
        }, clickAnim);
        anim.onComplete.add(function() {
            this.visible = false;
        }, clickAnim);

    });

    group.add(clickAnim);
}

function initGUIDisplayElements() {

    // Creating the Panel
    panel = new Panel(phaserGame);
    panel.appendTo(group);

    // Setting up the Minimap and attacing to the Panel
    minimap = new Minimap({ phaserGame, map, entityManager, userPointer, playerManager });
    minimap.appendTo(panel, 0, 61);

    // Setting up the EntityDetailsDisplay and linking it to the Panel
    entityDetailsDisplay = new EntityDetailsDisplay(entityManager);
    entityDetailsDisplay.appendTo(panel, 200, 110);

    // ControlPanel
    controlPanel = new ControlPanel({ entityManager, phaserGame });
    controlPanel.appendTo(panel, 815, 15);

    // Resource display
    resourceDisplay = new ResourceDisplay(playerManager);
    resourceDisplay.appendTo(panel, 425, 88);
}


GUI.prototype = {

    /**
     * Placing and triggering the click animation onto the game area
     * @param  {integer} x
     * @param  {integer} y
     * @param  {integer} anim
     * @return {void}
     */
    putClickAnim: function(x, y, anim) {
        if (undefined === anim) {
            anim = 'click-move';
        }
        clickAnim.x = x;
        clickAnim.y = y;
        clickAnim.animations.stop(null, true);
        clickAnim.play(anim, CLICK_ANIM_FRAMERATE);
    },

    /**
     * Updating the renderable elements 
     * @return {void} 
     */
    update: function() {

        if (minimap) {
            minimap.update();
        }

        if (entityDetailsDisplay) {
            entityDetailsDisplay.update();
        }
    },

    /**
     * Linking the Selector object to a Entity
     * @param {Entity} entity 
     */
    addSelector: function(entity) {
        const selector = new Selector(phaserGame);
        selector.appendTo(entity);
        return selector;
    },

    /**
     * Links the given entity to a new EnergyShield instance
     * @param {object} entity Instance of Eneity 
     */
    addEnergyShield: function(entity) {
        const energyShield = new EnergyShield(phaserGame);
        energyShield.appendTo(entity);
        return energyShield;
    },

    /**
     * Links the given entity to a new ColorIndicator instance
     * @param {object} entity Instance of Eneity 
     */
    addColorIndicator: function(entity) {
        const colorIndicator = new ColorIndicator(phaserGame);
        colorIndicator.appendTo(entity);
        return colorIndicator;
    },

    /**
     * Linking the StatusDisplay object to a Entity
     * @param {Entity} entity 
     */
    addStatusDisplay: function(entity) {
        const statusDisplay = new StatusDisplay(phaserGame);
        statusDisplay.appendTo(entity);
        return statusDisplay;
    },

    /**
     * Return a boolean value declaring whether the primary input is however the panel
     * @return {Boolean} [true if the primary input is over the panel sprite]
     */
    isHover: function() {
        return userPointer.isHover(panel);
    }

};

export default {

    /**
     * Passing the ultimate Phaser.Game object in order to access basic Phaser functionality  
     * @param {void}
     */
    setGame: function(game) {
        phaserGame = game;
        return this;
    },

    /**
     * Passing the entityManager object to retrive Entity objects in order to display
     * entity attributes on the Panel
     * @param {objet} [_entityManager] [reference to EntityManager singleton]
     * @param {void}
     */
    setEntityManager: function(_entityManager) {
        entityManager = _entityManager;
        return this;
    },

    /**
     * Passing the Map object to fetch map details mostly for rendering the Minimap 
     * @param {objet} [_map] [reference to Map singleton]
     * @param {void}
     */
    setMap: function(_map) {
        map = _map;
        return this;
    },

    /**
     * UserPointer object to register custom listeners for interactions with the mouse
     * @param {object} _userPointer UserPointer
     */
    setUserPointer: function(_userPointer) {
        userPointer = _userPointer;
        return this;
    },

    /**
     * Registers the playerManager instance into the execution context
     * @param {object} _playerManager [PlayerManager]
     */
    setPlayerManager: function(_playerManager) {
        playerManager = _playerManager;
        return this;
    },

    /**
     * Accessing the singleton instance of the GUI 
     * @param {boolean} forceNewInstance 
     * @return {object} GUI
     */
    getInstance: function(forceNewInstance) {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }
        if (!singleton || forceNewInstance) {
            singleton = new GUI();
        }
        return singleton;
    }
};
