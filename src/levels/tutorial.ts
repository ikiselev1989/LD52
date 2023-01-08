import { Vector } from 'excalibur';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Level } from '../abstract/level';
import { BaseResources } from '../constants/resources';

export class Tutorial extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('tutorialMap');
	protected cameraZoom = 2;

	async onInitialize(): Promise<void> {
		await super.onInitialize();

		const dest = new Vector(16, 32);

		this.showPath(dest);
		await this.moveTo(dest);
	}
}
