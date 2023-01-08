import { DisplayMode, Engine, Loadable, Loader } from 'excalibur';
import { Tutorial } from './levels/tutorial';
import { Levels } from './constants/levels';
import { Events } from './constants/events';
import { BaseResources } from './constants/resources';
import { Level1 } from './levels/level1';
import { Level } from './abstract/level';

export class Game extends Engine {
	constructor() {
		super({
			width: 640,
			height: 360,
			displayMode: DisplayMode.FitScreen,
			maxFps: 60,
			configurePerformanceCanvas2DFallback: {
				allow: true,
				showPlayerMessage: true,
				threshold: { fps: 20, numberOfFrames: 100 },
			},
		});

		this.setAntialiasing(false);

		const loader = new Loader([
			<Loadable<any>>BaseResources.get('animations'),
			<Loadable<any>>BaseResources.get('tiles'),
			<Loadable<any>>BaseResources.get('wind'),
			<Loadable<any>>BaseResources.get('tutorialMap'),
			<Loadable<any>>BaseResources.get('level1Map'),
		]);

		this.addScene(Levels.TUTORIAL, new Tutorial());
		this.addScene(Levels.LEVEL1, new Level1());

		this.start(loader).then(() => this.goToScene(Levels.TUTORIAL));
	}

	onInitialize(_engine: Engine) {
		super.onInitialize(_engine);

		this.addGlobalEvent(Events.GAME_OVER, async () => {
			await this.showCountPoints();
		});
	}

	public addGlobalEvent(event: Events, cb: () => any) {
		document.addEventListener(event, cb);
	}

	public emitGlobalEvent(event: Events) {
		document.dispatchEvent(new CustomEvent(event));
	}

	private async showCountPoints() {
		const level = <Level>this.currentScene;
		const points = await level.countPoints();

		requestAnimationFrame(() => {
			console.log(points);

			if (level.minPoints > points) {
				alert('try again!');
			} else {
				alert('well done!');
			}
		});
	}
}
