import { Loader } from 'excalibur';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Level } from '../abstract/level';

export class Tutorial extends Level {
	public tiledMap = new TiledMapResource('/maps/tutorial.tmx');
	public loader = new Loader([this.tiledMap]);
}
