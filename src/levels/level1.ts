import { Level } from '../abstract/level';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Wind } from '../constants/wind';
import { BaseResources } from '../constants/resources';

export class Level1 extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('level1Map');
	public minPoints = 5500;

	protected pathClickerAvailable = true;
	protected wind = Wind.S;
	protected cameraZoom = 1.6;
}
