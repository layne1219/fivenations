define('Game', [
    'Graphics',
    'Map',
    'PlayerManager', 
    'EntityManager',
    'GUI',
    'UserPointer', 
    'UserKeyboard', 
    'Util'
], function(Graphics, Map, PlayerManager, EntityManager, GUI, UserPointer, UserKeyboard, Util) {
    'use strict';

    var ns = window.fivenations,
        gui,
        unit, unit2;

    function Game() {}    

    Game.prototype = {

        preloader: function(){

        },

        create: function () {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

            // -----------------------------------------------------------------------
            //                                  Graphics
            // -----------------------------------------------------------------------
            // Graphics object gathering functonality that assist in rendering
            Graphics.setGame(this.game);            
            this.graphics = Graphics.getInstance();

            // -----------------------------------------------------------------------
            //                                  Map
            // -----------------------------------------------------------------------
            // Generate a Map
            this.map = new Map();
            this.map.setGame(this.game);

            // -----------------------------------------------------------------------
            //                                  Players
            // -----------------------------------------------------------------------
            // Set up Players
            this.playerManager = PlayerManager.getInstance();
            this.playerManager.addPlayer( { team: 1, user: true } );
            this.playerManager.addPlayer( { team: 2 });
            this.playerManager.addPlayer( { team: 3 });
            this.playerManager.addPlayer( { team: 4 });

            // -----------------------------------------------------------------------
            //                              EntityManager
            // -----------------------------------------------------------------------
            // Set up the EntityManager
            EntityManager.setGame(this.game);
            this.entityManager = EntityManager.getInstance();

            // -----------------------------------------------------------------------
            //                              UserPointer
            // -----------------------------------------------------------------------
            // Set up User pointer
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();

            // Right Mouse Button to send units to a position
            this.userPointer.on('rightbutton/down', (function(){

                var rnd, coords,
                    entities = this.entityManager.getAllSelected().filter(function(entity){
                        return EntityManager.getInstance().isEntityControlledByUser(entity);
                    });

                // send the selected units to the specified coordinates
                if (entities.length > 0){
                    coords = this.userPointer.getRealCoords();
                    rnd = entities.length === 1 ? 0 : (entities.length * 4);
                    entities.forEach(function(entity){
                        entity.moveTo(coords.x - rnd / 2 + Util.rnd(0, rnd), coords.y - rnd / 2 + Util.rnd(0, rnd));
                    });

                    // put the click animation to the game scene
                    this.GUI.putClickAnim(coords.x, coords.y);
                }
                    
            }).bind(this));

            // Unselecting units when clicking over an area with no entities underneath
            this.userPointer.on('leftbutton/down', (function(){

                // If the user is hovering the mouse pointer above the GUI, the selection must remain untouched
                if (GUI.getInstance().isHover()){
                    return;
                }

                // If the user pointer isn't over the GUI area, nor any entities
                if (this.entityManager.getAllHover().length === 0){
                    this.entityManager.unselectAll();
                } 

                gui.frame++;
                console.log(gui.frame);

            }).bind(this));

            this.userPointer.on('multiselector/up', (function(multiselector){

                this.entityManager.get().forEach(function(entity){
                    if (!EntityManager.getInstance().isEntityControlledByUser(entity)){
                        return;
                    }
                    if (entity.isInside(multiselector)){
                        entity.select();
                    }
                });              

            }).bind(this));

            this.userPointer.on('leftbutton/double', function(){
                console.log('double clicked');
            });

            // -----------------------------------------------------------------------
            //                              UserKeyboard
            // -----------------------------------------------------------------------
            // Set up UserKeyboard
            UserKeyboard.setGame(this.game);
            this.userKeyboard = UserKeyboard.getInstance();

            this.userKeyboard
                .on('cursor/down', this.map.scrollDown.bind(this.map))
                .on('cursor/up', this.map.scrollUp.bind(this.map))
                .on('cursor/left', this.map.scrollLeft.bind(this.map))
                .on('cursor/right', this.map.scrollRight.bind(this.map));

            // -----------------------------------------------------------------------
            //                              GUI
            // -----------------------------------------------------------------------
            // Set up the GUI object 
            this.GUI = GUI.setGame(this.game)
                          .setMap(this.map)
                          .setEntityManager(this.entityManager)
                          .setUserPointer(this.userPointer)
                          .getInstance();

            gui = this.game.add.sprite(10, 10, 'gui.icons.fed');
            gui.visible = true;
            gui.frame = 15;
            Graphics.getInstance().getGroup('entities').add(gui);

            // -----------------------------------------------------------------------
            //                              Physic engine
            // -----------------------------------------------------------------------
            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // -----------------------------------------------------------------------
            //                          Generating entities
            // -----------------------------------------------------------------------
            // TENTATIVE CODE SNIPPET
            for (var i = 25; i >= 0; i--) {
                this.entityManager.add({
                    id: Util.rnd(1, 2) === 1 ? 'hurricane' : 'orca',
                    team: 1//Util.rnd(1, this.playerManager.getPlayersNumber())
                });
            }

            this.entityManager.add({
                id: "orca",
                team: 1
            });

            this.entityManager.add({
                id: "hailstorm",
                team: 1
            });            

            this.entityManager.add({
                id: "stgeorge",
                team: 1
            });

            this.entityManager.add({
                id: "avenger",
                team: 1
            });

            this.entityManager.add({
                id: "avenger2",
                team: 1
            });

            this.entityManager.add({
                id: "icarus",
                team: 1
            });

            this.entityManager.add({
                id: "kutuzov",
                team: 1
            });

            this.entityManager.add({
                id: "teller",
                team: 1
            });

            this.entityManager.add({
                id: "dresda",
                team: 1
            });

            this.entityManager.add({
                id: "crow",
                team: 1
            });

            this.entityManager.add({
                id: "engineershuttle",
                team: 1
            });

            this.entityManager.add({
                id: "commandcenter",
                team: 1,
                x: 250,
                y: 250
            });                                                          

            this.entityManager.get().forEach(function(entity){
                entity.moveTo(Util.rnd(0, 500), Util.rnd(0, 500));
            });
            
        },

        update: function () {

            // Rendering the map
            this.map.update();

            // Rendering the units
            this.entityManager.get().forEach(function(entity){
                entity.update();
            });

            // Rendering GUI elements
            this.GUI.update();

            // Rendering the Selector
            this.userPointer.update();

            // Dispathcing events when holding a key down
            this.userKeyboard.update();

            this.game.time.advancedTiming = true;
            this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');  
        }

    };

  return Game;
});
