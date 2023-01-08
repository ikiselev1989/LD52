import { Level } from '../abstract/level';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Wind } from '../constants/wind';
import { BaseResources } from '../constants/resources';

export class Level4 extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('level4Map');
	public minPoints = 3000;

	protected pathClickerAvailable = true;
	protected wind = Wind.CALM;
	protected cameraZoom = 1.3;
	protected actorSpeed = 40;
}
