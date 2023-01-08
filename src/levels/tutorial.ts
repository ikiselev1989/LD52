import { Color, Font, FontUnit, Label, TextAlign, Vector } from 'excalibur';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { Level } from '../abstract/level';
import { BaseResources } from '../constants/resources';
import { Wind } from '../constants/wind';

export class Tutorial extends Level {
	public tiledMap = <TiledMapResource>BaseResources.get('tutorialMap');
	wind = Wind.NE;
	protected cameraZoom = 2;
	protected fireDelay = 1000;

	async onActivate() {
		const fontConfig = {
			family: 'impact',
			size: 8,
			unit: FontUnit.Px,
			color: Color.White,
			smoothing: false,
			quality: 5,
			shadow: {
				color: Color.Black,
				offset: new Vector(4, 4),
			},
		};

		this.engine.clock.schedule(() => {
			this.add(new Label({
				pos: this.engine.screen.screenToWorldCoordinates(new Vector(32, 20)),
				text: '⬅ Check wind direction',
				font: new Font(fontConfig),
			}));
		}, 1000);

		this.engine.clock.schedule(() => {
			this.add(new Label({
				pos: new Vector(1.25 * 16, 6 * 16),
				text: '⬅ Isolate the fire ➡',
				font: new Font(fontConfig),
			}));
		}, 7000);

		this.engine.clock.schedule(() => {
			this.add(new Label({
				pos: new Vector(16, 0.8 * 16),
				text: 'Click on point! \n⬇',
				font: new Font({
					...fontConfig,
					textAlign: TextAlign.Center,
				}),
			}));

			const dest = new Vector(16, 32);

			this.showPath(dest);
			this.moveTo(dest);
		}, 2000);
	}
}
