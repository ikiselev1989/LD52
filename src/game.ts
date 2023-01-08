import { DisplayMode, Engine, Loadable, Loader } from 'excalibur';
import { Tutorial } from './levels/tutorial';
import { Levels } from './constants/levels';
import { Events } from './constants/events';
import { BaseResources } from './constants/resources';
import { Level1 } from './levels/level1';
import { Level4 } from './levels/level4';
import { Level5 } from './levels/level5';
import { Level2 } from './levels/level2';
import { Level3 } from './levels/level3';

const scenesList = [
	Levels.TUTORIAL,
	Levels.LEVEL1,
	Levels.LEVEL2,
	Levels.LEVEL3,
	Levels.LEVEL4,
	Levels.LEVEL5,
];

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
			<Loadable<any>>BaseResources.get('level2Map'),
			<Loadable<any>>BaseResources.get('level3Map'),
			<Loadable<any>>BaseResources.get('level4Map'),
			<Loadable<any>>BaseResources.get('level5Map'),
		]);

		this.addScene(Levels.TUTORIAL, new Tutorial());
		this.addScene(Levels.LEVEL1, new Level1());
		this.addScene(Levels.LEVEL2, new Level2());
		this.addScene(Levels.LEVEL3, new Level3());
		this.addScene(Levels.LEVEL4, new Level4());
		this.addScene(Levels.LEVEL5, new Level5());

		this.start(loader).then(() => this.goToScene(<Levels>scenesList.shift()));
	}

	onInitialize(_engine: Engine) {
		super.onInitialize(_engine);

		this.addGlobalEvent(Events.GAME_OVER, async () => {
			const next = <Levels>scenesList.shift();

			next && this.goToScene(next);
		});
	}

	public addGlobalEvent(event: Events, cb: () => any) {
		document.addEventListener(event, cb);
	}

	public emitGlobalEvent(event: Events) {
		document.dispatchEvent(new CustomEvent(event));
	}
}
