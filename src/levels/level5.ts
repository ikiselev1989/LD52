import { Level } from '../abstract/level';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Wind } from '../constants/wind';
import { BaseResources } from '../constants/resources';

export class Level5 extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('level5Map');
	public minPoints = 0;

	protected pathClickerAvailable = false;
	protected wind = Wind.CALM;
	protected cameraZoom = 1.6;
}
