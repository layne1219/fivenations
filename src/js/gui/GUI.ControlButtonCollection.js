// ------------------------------------------------------------------------------------
// Stop Button Logc
// ------------------------------------------------------------------------------------
define('GUI.StopButtonLogic', ['Universal.EventEmitter'], function(EventEmitter) {
    return {
        activate: function() {
            EventEmitter
                .getInstance()
                .synced
                .entities(':user:selected')
                .reset()
                .stop({ resetActivityQueue: true });
        }
    };
});

// ------------------------------------------------------------------------------------
// Move Button Logc
// ------------------------------------------------------------------------------------
define('GUI.MoveButtonLogic', [
    'GUI.Activity.SelectCoords',
    'GUI.ActivityManager',
    'Universal.EventEmitter',
], function(ActivitySelectCoords, ActivityManager, EventEmitter) {
    var ns = window.fivenations;
    return {
        activate: function(entityManager, controlPanel) {
            var activity = ActivityManager.getInstance().start(ActivitySelectCoords);
            activity.on('select', function(mousePointer) {

                var coords = mousePointer.getRealCoords();

                EventEmitter
                    .getInstance()
                    .synced
                    .entities(':user:selected')
                    .move({
                        x: coords.x,
                        y: coords.y
                    });

                ns.game.GUI.putClickAnim(coords.x, coords.y);
                controlPanel.selectMainPage();
            });
            // @TODO this should be unified as most of the buttons share this logic
            controlPanel.selectCancelPage();
        }
    };
});

// ------------------------------------------------------------------------------------
// Patrol Button Logic
// ------------------------------------------------------------------------------------
define('GUI.PatrolButtonLogic', [
    'GUI.Activity.SelectCoords',
    'GUI.ActivityManager',
    'Universal.EventEmitter',
], function(ActivitySelectCoords, ActivityManager,EventEmitter) {
    var ns = window.fivenations;
    return {
        activate: function(entityManager, controlPanel) {
            var activity = ActivityManager.getInstance().start(ActivitySelectCoords);
            activity.on('select', function(mousePointer) {
                var coords = mousePointer.getRealCoords();

                EventEmitter
                    .getInstance()
                    .synced
                    .entities(':user:selected')
                    .patrol({
                        x: coords.x,
                        y: coords.y
                    });

                ns.game.GUI.putClickAnim(coords.x, coords.y);
                controlPanel.selectMainPage();
            });
            // @TODO this should be unified as most of the buttons share this logic
            controlPanel.selectCancelPage();
        }
    };
});

// ------------------------------------------------------------------------------------
// Cancel Button Logc
// ------------------------------------------------------------------------------------
define('GUI.CancelButtonLogic', [
    'GUI.ActivityManager'
], function(ActivityManager) {
    return {
        activate: function(entityManager, controlPanel) {
            controlPanel.selectMainPage();
            ActivityManager.getInstance().cancel();
        }
    };
});

// ------------------------------------------------------------------------------------
// Attack Button Logc
// ------------------------------------------------------------------------------------
define('GUI.AttackButtonLogic', [
    'GUI.Activity.SelectCoords',
    'GUI.ActivityManager',
    'Universal.EventEmitter',
], function(ActivitySelectCoords, ActivityManager, EventEmitter) {
    return {
        activate: function(entityManager, controlPanel) {
            var activity = ActivityManager.getInstance().start(ActivitySelectCoords);
            activity.on('select', function() {

                var targetEntity;
                entityManager.entities().filter(function(entity) {
                    if (entity.isHover()) {
                        targetEntity = entity;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (targetEntity) {
                    EventEmitter
                        .getInstance()
                        .synced
                        .entities(':user:selected')
                        .attack({
                            targetEntity: targetEntity
                        });
                    targetEntity.selectedAsTarget();
                }

                controlPanel.selectMainPage();
            });

            controlPanel.selectCancelPage();
        }
    };
});

// ------------------------------------------------------------------------------------
// Follow Button Logc
// ------------------------------------------------------------------------------------
define('GUI.FollowButtonLogic', [
    'GUI.Activity.SelectCoords',
    'GUI.ActivityManager',
    'Universal.EventEmitter',
], function(ActivitySelectCoords, ActivityManager, EventEmitter) {
    return {
        activate: function(entityManager, controlPanel) {
            var activity = ActivityManager.getInstance().start(ActivitySelectCoords);
            activity.on('select', function() {

                var targetEntity;
                entityManager.entities().filter(function(entity) {
                    if (entity.isHover()) {
                        targetEntity = entity;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (targetEntity) {
                    EventEmitter
                        .getInstance()
                        .synced
                        .entities(':user:selected')
                        .follow({
                            targetEntity: targetEntity
                        });
                    targetEntity.selectedAsTarget();
                }

                controlPanel.selectMainPage();
            });

            controlPanel.selectCancelPage();
        }
    };
});

// ------------------------------------------------------------------------------------
// Dock Button Logc
// ------------------------------------------------------------------------------------
define('GUI.DockButtonLogic', [
    'GUI.Activity.SelectCoords',
    'GUI.ActivityManager',
    'Universal.EventEmitter',
], function(ActivitySelectCoords, ActivityManager, EventEmitter) {
    return {
        activate: function(entityManager, controlPanel) {
            var activity = ActivityManager.getInstance().start(ActivitySelectCoords);
            activity.on('select', function() {

                var targetEntity;
                entityManager.entities().filter(function(entity) {
                    if (entity.isHover()) {
                        targetEntity = entity;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (targetEntity) {
                    EventEmitter
                        .getInstance()
                        .synced
                        .entities(':user:selected')
                        .getToDock({
                            targetEntity: targetEntity
                        });
                    targetEntity.selectedAsTarget();
                }

                controlPanel.selectMainPage();
            });

            controlPanel.selectCancelPage();
        }
    };
});

// ------------------------------------------------------------------------------------
// Dock Button Logc
// ------------------------------------------------------------------------------------
define('GUI.UndockButtonLogic', [
    'Universal.EventEmitter',
], function(EventEmitter) {
    return {
        activate: function() {
            EventEmitter
                .getInstance()
                .synced
                .entities(':user:selected')
                .reset()
                .undock();
        }
    };    
});




define('GUI.ControlButtonCollection', [
    'GUI.StopButtonLogic',
    'GUI.MoveButtonLogic',
    'GUI.PatrolButtonLogic',
    'GUI.CancelButtonLogic',
    'GUI.AttackButtonLogic',
    'GUI.FollowButtonLogic',
    'GUI.DockButtonLogic',
    'GUI.UndockButtonLogic',
    'json!abilities'
], function(
    StopButtonLogic, 
    MoveButtonLogic, 
    PatrolButtonLogic, 
    CancelButtonLogic, 
    AttackButtonLogic,
    FollowButtonLogic,
    DockButtonLogic,
    UndockButtonLogic,
    abilitiesJSON
) {

    var buttonLogics = {};

    buttonLogics[abilitiesJSON.stop] = StopButtonLogic;
    buttonLogics[abilitiesJSON.move] = MoveButtonLogic;
    buttonLogics[abilitiesJSON.patrol] = PatrolButtonLogic;
    buttonLogics[abilitiesJSON.cancel] = CancelButtonLogic;
    buttonLogics[abilitiesJSON.attack] = AttackButtonLogic;
    buttonLogics[abilitiesJSON.follow] = FollowButtonLogic;
    buttonLogics[abilitiesJSON.dock] = DockButtonLogic;
    buttonLogics[abilitiesJSON.undock] = UndockButtonLogic;

    return {

        getLogicByControlButton: function(controlButton) {
            if (!controlButton) {
                return;
            }
            return this.getLogicById(controlButton.getId());
        },

        getLogicById: function(id) {
            if (!buttonLogics[id]) {
                throw 'There is no ButtonLogic registered to the given Id';
            }
            return buttonLogics[id];
        }

    }

});