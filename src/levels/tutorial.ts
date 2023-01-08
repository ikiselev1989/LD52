import { Loader, Vector } from 'excalibur';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Level } from '../abstract/level';

export class Tutorial extends Level {
	public tiledMap = new TiledMapResource('/maps/tutorial.tmx');
	public loader = new Loader([this.tiledMap]);

	async onInitialize(): Promise<void> {
		await super.onInitialize();

		const dest = new Vector(16, 32);

		this.showPath(dest);
		this.moveTo(dest);
	}
}
