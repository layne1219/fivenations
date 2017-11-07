import Graphics from '../common/Graphics';
import { GROUP_FOGOFWAR } from '../common/Const';

const ns = window.fivenations;

class FogOfWarRenderer {

  constructor(map) {

    this.initBitMapData(map);
    this.map = map;

  }

  initBitMapData(map) {
    const width = ns.window.width;
    const height = ns.window.height;
    const group = Graphics.getInstance().getGroup(GROUP_FOGOFWAR);

    this.bmd = phaserGame.add.bitmapData(width, height);
    this.body = this.bmd.addToWorld(0, 0);

    group.add(body);
  }

}

export { FogOfWarRenderer };
export default FogOfWarRenderer;
