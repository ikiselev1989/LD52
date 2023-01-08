import { Level } from '../abstract/level';
import { Loader } from 'excalibur';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Wind } from '../constants/wind';

export class Level1 extends Level {
	public tiledMap = new TiledMapResource('/maps/level1.tmx');
	public loader = new Loader([this.tiledMap]);

	protected pathClickerAvailable = true;
	protected wind = Wind.SW;
	protected cameraZoom = 1.6;
}
