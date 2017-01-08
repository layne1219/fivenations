define('Universal.Event.Entity.Fire', [
    'Universal.Event'
], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityFire() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityFire.prototype = Object.create(Event.prototype);
    UniversalEventEntityFire.prototype.constructor = UniversalEventEntityFire;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    UniversalEventEntityFire.prototype.execute = function(options) {
        if (!options.targets || !options.data) {
            return;
        }
        var entity;
        var targetEntity;
        var weapons;

        options.targets.forEach(function(id, idx) {
            entity = ns.game.entityManager.entities(id);
            targetEntity = ns.game.entityManager.entities(options.data.targetEntity);
            
            if (!entity || !targetEntity) return;
            if (!options.data.weaponIndexes[idx]) return;

            weapons = entity.getWeaponManager().getWeapons().filter(function(weapon, weaponIndex) {
                for (var i = options.data.weaponIndexes[idx].length - 1; i >= 0; i -= 1) {
                    if (options.data.weaponIndexes[idx][i] === weaponIndex) {
                        return true;
                    }   
                }
                return false;
            });

            entity.fire(targetEntity, weapons);

        }); 
    };

    return UniversalEventEntityFire;

});