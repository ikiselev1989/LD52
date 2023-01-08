import { Level } from '../abstract/level';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Wind } from '../constants/wind';
import { BaseResources } from '../constants/resources';

export class Level2 extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('level2Map');
	public minPoints = 6000;

	protected pathClickerAvailable = true;
	protected wind = Wind.N;
	protected cameraZoom = 1.2;
}
