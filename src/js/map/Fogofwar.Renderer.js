import Graphics from '../common/Graphics';
import { GROUP_FOGOFWAR } from '../common/Const';

const ns = window.fivenations;
const screenWidth = ns.window.width;
const screenHeight = ns.window.height;

class FogOfWarRenderer {

    constructor(map) {
        this.initGame(map);
        this.initBitMapData();
        this.initFogOfWar(map);
    }

    initGame(map) {
        this.game = map.getGame();
    }

    initBitMapData(map) {
        const group = Graphics.getInstance().getGroup(GROUP_FOGOFWAR);

        this.bmd = this.game.add.bitmapData(screenWidth, screenHeight);
        this.body = this.bmd.addToWorld(0, 0);

        group.add(body);
    }

    initFogOfWar(map) {
        this.fogOfWar = map.getFogofwar();
    }

    update() {
        const tileWidth = map.getTileWidth();
        const visibleMatrixWidth = screenWidth / tileWidth;
        const visibleMatrixHeight = screenHight / tileWidth; 
    }

}

export { FogOfWarRenderer };
export default FogOfWarRenderer;
