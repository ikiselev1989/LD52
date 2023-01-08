import { DisplayMode, Engine, Loadable, Loader } from 'excalibur';
import { Tutorial } from './levels/tutorial';
import { Levels } from './constants/levels';
import { Events } from './constants/events';
import { BaseResources } from './constants/resources';

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

		const loader = new Loader([<Loadable<any>>BaseResources.get('animations'), <Loadable<any>>BaseResources.get('tiles')]);

		this.addScene(Levels.TUTORIAL, new Tutorial());

		this.start(loader).then(() => this.goToScene(Levels.TUTORIAL));
	}

	onInitialize(_engine: Engine) {
		super.onInitialize(_engine);

		this.addGlobalEvent(Events.GAME_OVER, () => {
			alert('game over');
		});
	}

	public addGlobalEvent(event: Events, cb: () => any) {
		document.addEventListener(event, cb);
	}

	public emitGlobalEvent(event: Events) {
		document.dispatchEvent(new CustomEvent(event));
	}
}
