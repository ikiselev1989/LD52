import { Level } from '../abstract/level';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Wind } from '../constants/wind';
import { BaseResources } from '../constants/resources';

export class Level3 extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('level3Map');
	public minPoints = 3900;

	protected pathClickerAvailable = true;
	protected wind = Wind.W;
	protected cameraZoom = 1.2;
}
