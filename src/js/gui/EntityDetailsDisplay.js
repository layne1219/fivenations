import Util from '../common/Util';
const guiJSON = require('../../assets/datas/common/gui.json'); 

const weaponNumber = 12;
const weaponPopupPaddingX = 20;
const weaponPopupPaddingY = 0;

const iconWidth = 51;
const iconHeight = 51;
const margin = 1;
const columns = 11;
const rows = 2;
const statusBarHeight = 3;
const statusBarMargin = 2;

const entityIcons = guiJSON.icons;
const text = {
    marginLeft: 132,
    marginTop: 5,
    titleFont: '12px BerlinSansFB-Reg',
    defaultFont: '11px BerlinSansFB-Reg',
    color: '#77C7D2'
};

/**
 * Returns a map of icons with keys set as the sprite key of the icons
 * @param {object} container Container into which the sprites will be added
 * @return {object} map of sprites
 */
function createIconSprites(container, phaserGame) {
    const sprites = {
        'gui.icons.fed': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.fed')),
        'gui.icons.ath': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.ath')),
        'gui.icons.syl': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.syl')),
        'gui.icons.tho': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.tho')),
        'gui.icons.obj': container.add(phaserGame.add.sprite(0, 0, 'gui.icons.obj'))
    };
    function each(callback) {
        Object.keys(sprites).forEach(function(key) {
            callback.call(container, sprites[key]);
        });
    }
    let last;

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

class MainAttributeGroup extends Phaser.Group {

    constructor(phaserGame) {

        super(phaserGame);

        // creating a Phaser.Sprite object for the entity icons
        this.iconSprites = createIconSprites(this, phaserGame);

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

    /**
     * Updating the attributes text group as per the passed dataObject
     * @param  {object} entity [Entity instance]
     * @return {void}
     */
    updateContent(entity) {

        var dataObject = entity.getDataObject();

        if (!dataObject) {
            throw 'Invalid DataObject has been passed!';
        }

        this.iconSprites.show(entityIcons[dataObject.getId()].spriteId, entityIcons[dataObject.getId()].faceFrame);

        // Names
        this.nameElm.text = dataObject.getName();
        this.nicknameElm.text = dataObject.getType();

        // Hull
        const hullTitle = 'Hull: ';
        const hullValue = dataObject.getHull();
        const hullMaxValue = '/' + dataObject.getMaxHull();
        const hullColor = Util.getColorFromRatio(dataObject.getHull() / dataObject.getMaxHull(), 'hex');

        this.hullElm.text = hullTitle + hullValue + hullMaxValue;
        this.hullElm.addColor(hullColor, hullTitle.length);

        // Shield
        const shieldTitle = 'Shield: ';
        const shieldValue = dataObject.getShield();
        const shieldMaxValue = '/' + dataObject.getMaxShield();

        this.shieldElm.text = shieldTitle + shieldValue + shieldMaxValue;
        this.shieldElm.addColor('#475D86', shieldTitle.length);

        // Armor
        const armorTitle = 'Armor: ';
        const armorValue = dataObject.getArmor();

        this.armorElm.text = armorTitle + armorValue;
        this.armorElm.addColor('#FFFFFF', armorTitle.length);

        // Power
        const powerTitle = 'Power: ';
        const powerValue = dataObject.getPower();
        const powerMaxValue = '/' + dataObject.getMaxPower();

        this.powerElm.text = powerTitle + powerValue + powerMaxValue;
        this.powerElm.addColor('#FFFFFF', powerTitle.length);

        // Hangar
        const hangarTitle = 'Hangar: ';
        const hangarValue = entity.getNumberOfDockerEntities();
        const hangarMaxValue = '/' + dataObject.getMaxHangar();

        this.hangarElm.text = hangarTitle + hangarValue + hangarMaxValue;
        this.hangarElm.addColor('#FFFFFF', hangarTitle.length);

    }

}

class WeaponGroup extends Phaser.Group {

    constructor(phaserGame) {
        super(phaserGame);
        this.initWeaponText(phaserGame);
        this.initEventDispatcher();
    }

    initWeaponText(phaserGame) {
        let weaponText, i, x, y;

        this.weaponTexts = [];

        for (i = 0; i < weaponNumber; i += 1) {
            x = text.marginLeft + Math.floor(i / 8) * 100;
            y = text.marginTop + (i % 8 + 1) * 11;
            weaponText = this.add(phaserGame.add.text(x, y, '', {
                font: text.defaultFont,
                fill: text.color
            }));
            weaponText.inputEnabled = true;
            weaponText.events.onInputOver.add(over, this);
            weaponText.events.onInputOut.add(out, this);

            this.weaponTexts.push(weaponText);
        }

        function over(item) {
            this.dispatcher.dispatch('over', item);
            item.alpha=.5;
        }

        function out(item) {
            this.dispatcher.dispatch('out', item);
            item.alpha=1;
        }

    }

    initEventDispatcher() {
        this.dispatcher = new Util.EventDispatcher();
    }

    /**
     * Registers event listener to the given event
     * @param  {string}   event    [the given event]
     * @param  {Function} callback [the callback to be registered]
     * @return {void}
     */
    on(event, callback) {
        this.dispatcher.addEventListener(event, callback);
    }

    /**
     * Updating the attributes text group as per the passed dataObject
     * @param  {object} entity [Entity]
     * @return {void}
     */
    updateContent(entity) {

        if (!entity) {
            throw 'Invalid Entity instance has been passed!';
        }

        for (var i = weaponNumber - 1; i >= 0; i -= 1) {
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

    }
}

class WeaponGroupPopup extends Phaser.Group {

    constructor(phaserGame){

        super(phaserGame);

        this.setDefaultVisiblity();
        this.initBackgroundSprite(phaserGame);
        this.initTextComponents(phaserGame);
    }

    setDefaultVisiblity() {
        this.visible = false;
    }

    initBackgroundSprite(phaserGame) {
        this.background = phaserGame.add.sprite(0, 0, 'gui');
        this.background.frame = 115;
        this.add(this.background);
    }

    initTextComponents(phaserGame) {
        const marginLeft = 20;
        const marginTop = 15;

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
    }

    updateContent(weapon){

        let title;
        let value; 
        let upgradedValue; 
        let output;

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
    }
    
}


class MultiselectionGroup extends Phaser.Group {
    
    constructor(phaserGame, entityManager) {
        super(phaserGame);
        this.initComponents(phaserGame, entityManager);
    }

    initComponents(phaserGame, entityManager) {
        this.entities = [];
        this.icons = [];
        this.healthBar = [];
        this.shieldBar = [];

        for (let i = columns * rows - 1; i >= 0; i -= 1) {

            const x = i % columns * (iconWidth + margin);
            const y = Math.floor(i / columns) * (iconHeight + margin);

            // StatusBars
            this.healthBar[i] = this.add(phaserGame.add.graphics(x + statusBarMargin, y + iconHeight - statusBarHeight - statusBarMargin));
            this.shieldBar[i] = this.add(phaserGame.add.graphics(x + statusBarMargin, y + iconHeight - statusBarHeight * 2 - statusBarMargin - 1));

            // Icons
            this.icons[i] = createIconSprites(this, phaserGame);
            this.icons[i].move(x, y);
            this.icons[i].click((idx => {
                return function() {
                    entityManager.unselectAll(this.entities[idx]);
                };
            })(i), this);
        }

        
    }

    /**
     * Updating the list of selected units
     * @param  {array} entities [Collection of Entity instances]
     * @return {void}
     */
    updateContent(entities) {

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

    }

    renderBar(graphics, ratio, color) {
        graphics.visible = true;
        graphics.clear();
        graphics.beginFill(color || Util.getColorFromRatio(ratio));
        graphics.drawRect(0, 0, Math.floor(iconWidth * ratio) - statusBarMargin * 2, statusBarHeight);
        graphics.endFill();
    }

}

export default class EntityDetailsDisplay {

    /**
     * Constructing an EntityDetailsDisplay instance
     * @param {object} entityManager [reference to the singleton instance of EntityManager]
     */
    constructor({ entityManager, phaserGame }) {

        // creating the group for the individual StatusBar objects
        this.group = phaserGame.add.group();
        this.group.visible = false;

        // storing the entity manager locally
        this.entityManager = entityManager;

        // setting up the text group
        this.attributeGroup = this.createAttributeGroup(0, 0, phaserGame);

        // setting up the group for the icons showing up when it comes to multiselection
        this.multiselectionGroup = this.createMultiselectionGroup(0, 5, phaserGame, this.entityManager);

        this.group.add(this.attributeGroup);
        this.group.add(this.multiselectionGroup);
    }

    createAttributeGroup(x, y, phaserGame) {

        let container;
        let mainAttributeGroup;
        let weaponGroup;
        let weaponGroupPopup;

        container = phaserGame.add.group();

        mainAttributeGroup = new MainAttributeGroup(phaserGame);
        mainAttributeGroup.x = x;
        mainAttributeGroup.y = y;

        weaponGroup = new WeaponGroup(phaserGame);
        weaponGroup.x = x + 100;
        weaponGroup.y = y - 10;

        weaponGroupPopup = new WeaponGroupPopup(phaserGame);

        weaponGroup.add(weaponGroupPopup);
        weaponGroup.on('over', function(item){
            weaponGroupPopup.x = item.x + weaponPopupPaddingX;
            weaponGroupPopup.y = item.y - weaponGroupPopup.height + weaponPopupPaddingY;
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

    createMultiselectionGroup(x, y, phaserGame, entityManager) {

        const group = new MultiselectionGroup(phaserGame, entityManager);
        group.x = x;
        group.y = y;

        return group;
    }

    /**
     * Attach the Minimap object to the main GUI Panel
     * @param {object} panel Phaser.Sprite
     * @param {integer} x Horizontal offset from the parent's anchor point 
     * @param {integer} y Vertical offset from the parent's anchor point 
     */
    appendTo(panel, x, y) {

        if (!panel) {
            throw 'Invalid Phaser.Sprite object!';
        }

        this.group.x = x;
        this.group.y = y;
        panel.addChild(this.group);

        this.panel = panel;
    }

    /**
     * Refresing the graphics objects according to the current values of 
     * the exposed abilities of the entity
     * @return {[void]}
     */
    update() {

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

    }

    /**
     * Displaying the GUI elements for the single selection screen
     * @return {object} entity Entity
     */
    displaySingleEntityScene(entity) {

        this.attributeGroup.visible = true;
        this.multiselectionGroup.visible = false;

        // Updating the texts + splash icon
        for (var i = this.attributeGroup.children.length - 1; i >= 0; i -= 1) {
            //@TODO Phaser.Group.prototype.update.call(this);
            this.attributeGroup.children[i].updateContent(entity);
        }
    }

    /**
     * Displaying the GUI elements for the multi selection screen
     * @return {array} entities Array of Entity instances
     */
    displayMultipleEntityScene(entities) {
        // toggle between the single and multiselection panel
        this.attributeGroup.visible = false;
        this.multiselectionGroup.visible = true;

        // updating the list of the selected entities
        this.multiselectionGroup.updateContent(entities);

    }

    /**
     * Making the StatusDisplay visible
     * @return {[void]}
     */
    show() {
        this.group.visible = true;
    }

    /**
     * Making the StatusDisplay unvisible
     * @return {[void]}
     */
    hide() {
        this.group.visible = false;
    }

}
