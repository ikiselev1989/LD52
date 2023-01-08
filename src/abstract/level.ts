import {
	Actor,
	AnimationStrategy,
	Circle,
	Color,
	ImageSource,
	Line,
	Loader,
	Scene,
	Sprite,
	SpriteSheet,
	Tile,
	TileMap,
	Vector,
} from 'excalibur';
import { TiledMapResource, TiledObject, TiledObjectGroup } from '@excaliburjs/plugin-tiled';
import { Objects } from '../constants/objects';
import * as Config from '../constants/сonfig';
import { Layers } from '../constants/layers';
import { Events } from '../constants/events';
import { Game } from '../game';
import { Wind } from '../constants/wind';
import { BaseResources } from '../constants/resources';

export abstract class Level extends Scene {
	declare engine: Game;

	abstract tiledMap: TiledMapResource;
	abstract loader: Loader;
	protected player!: Actor;
	protected wind: Wind = Wind.CALM;
	protected windSpeed: number = 1;
	protected sprites!: SpriteSheet;
	private wheatLayer!: TileMap;
	private circleActor!: Actor;
	private actorSpeed: number = 25;
	private line: any;
	private line2: any;
	private lineActor!: Actor;
	private pathClickerAvailable = false;

	public async onInitialize() {
		this.loader.suppressPlayButton = true;

		await this.loader.load();

		this.tiledMap.addTiledMapToScene(this);
		this.wheatLayer = <TileMap>this.tiledMap.getTileMapLayers().find(layer => layer.name === Layers.WHEAT.toString());
		this.startFire();

		const { width, tileWidth, height, tileHeight } = this.tiledMap.data;

		this.camera.x = width / 2 * tileWidth;
		this.camera.y = height / 2 * tileHeight;
		this.camera.zoom = 2;

		this.addPlayer();

		this.sprites = SpriteSheet.fromImageSource({
			image: <ImageSource>BaseResources.get('tiles'),
			grid: {
				rows: 3,
				columns: 4,
				spriteWidth: 16,
				spriteHeight: 16,
			},
		});

		this.addPathClicker();
	}

	onPreUpdate() {
		if (this.engine.input.pointers.primary.lastWorldPos && this.circleActor) {
			this.showPath(this.pathClickerAvailable ? this.engine.input.pointers.primary.lastWorldPos : this.circleActor.pos);
		}

		if (this.player?.pos && this.wheatLayer) {
			this.rotatePlayer();

			[
				this.player.pos.add(new Vector(-8, 0).rotate(this.player.rotation)),
				this.player.pos.add(new Vector(8, 0).rotate(this.player.rotation)),
			].forEach(vec => {
				this.clearWheat(vec);
			});
		}

		if (this.player?.vel) {
			if (this.player.vel.equals(Vector.Zero)) {
				this.player.graphics.use(BaseResources.get('animations')!.data.getAnimation('CombineIdle'));
			} else {
				this.player.graphics.use(BaseResources.get('animations')!.data.getAnimation('Combine'));
			}
		}
	}

	protected startFire() {
		const fire = this.initFire();

		if (fire) {
			const tile = this.wheatLayer.getTileByPoint(new Vector(fire.x, fire.y));

			this.fireLoop([tile]);
		}
	}

	protected addPlayer() {
		const combineObj = this.tiledMap.data.getObjectLayerByName(Layers.OBJ).objects.find(obj => obj.name === Objects.COMBINE);

		const { x, y, width, height } = <TiledObject>combineObj;

		this.player = new Actor({
			x: x + (width || 0) / 2,
			y: y + (height || 0) / 3,
			anchor: new Vector(0.5, 0.33),
		});

		this.add(this.player);

		const animations = BaseResources.get('animations');

		this.player.graphics.use(animations!.data.getAnimation('CombineIdle'));
	}

	protected moveTo(dest: Vector) {
		if (!this.player.actions.getQueue().isComplete()) return;

		let { x, y } = dest;

		if (x === this.player.pos.x || y === this.player.pos.y) {
			this.player.actions.moveTo(dest, this.actorSpeed);
		} else {
			this.player.actions
				.moveTo([0, 180].includes(this.player.rotation * 180 / Math.PI) ? new Vector(this.player.pos.x, y) : new Vector(x, this.player.pos.y), this.actorSpeed)
				.moveTo(dest, this.actorSpeed);
		}
	}

	protected showPath(dest: Vector) {
		let { x, y } = dest;
		let { x: playerX, y: playerY } = this.player.pos;

		x = x % 16 < 8 ? (x - x % 16) : x + (16 - x % 16);
		y = y % 16 < 8 ? (y - y % 16) : y + (16 - y % 16);

		this.circleActor.pos = new Vector(x, y);

		this.lineActor.pos = this.player.pos;

		if (this.lineActor.pos.x === this.circleActor.pos.x || this.lineActor.pos.y === this.circleActor.pos.y) {
			this.line2.end = this.line2.start = new Vector(0, 0);
			this.line.start = this.player.pos.sub(this.lineActor.pos);
			this.line.end = this.circleActor.pos.sub(this.lineActor.pos);
		} else {
			const { rotation } = this.player;
			const lineEnd = [0, 180].includes(rotation * 180 / Math.PI) ? new Vector(playerX, y) : new Vector(x, playerY);

			this.line.end = this.line.start = new Vector(0, 0);

			this.line.start = this.player.pos.sub(this.lineActor.pos);
			this.line.end = lineEnd.sub(this.lineActor.pos);

			this.line2.start = this.line.end;
			this.line2.end = this.circleActor.pos.sub(this.lineActor.pos);
		}
	}

	private addPathClicker() {
		const circle = new Circle({
			radius: 4,
			color: Color.White,
			quality: 5,
			smoothing: false,
		});

		this.line = new Line({
			color: Color.White,
			start: new Vector(0, 0),
			end: new Vector(0, 0),
		});

		this.line2 = new Line({
			color: Color.White,
			start: new Vector(0, 0),
			end: new Vector(0, 0),
		});

		this.lineActor = new Actor();

		this.lineActor.graphics.use(this.line);
		this.lineActor.graphics.add(this.line2);

		this.add(this.lineActor);

		this.circleActor = new Actor({
			width: 32,
			height: 32,
		});

		this.circleActor.graphics.use(circle);

		this.add(this.circleActor);

		this.circleActor.on('pointerup', () => {
			if (!this.pathClickerAvailable) return;

			this.moveTo(this.circleActor.pos);
		});
	}

	private initFire() {
		const tiledObjectGroups: TiledObjectGroup = this.tiledMap.data.getObjectLayerByName(Layers.OBJ);
		return this.findFireCenter(tiledObjectGroups.objects) || null;
	}

	private fireLoop(fires: Tile[]) {
		if (!fires.length) {
			this.engine.emitGlobalEvent(Events.GAME_OVER);
			return;
		}

		let nextTiles: Tile[] = [];

		fires.forEach(tile => {
			const animations = BaseResources.get('animations');

			if (animations) {
				const anim = animations.data.getAnimation('fire').clone();
				anim.strategy = AnimationStrategy.Freeze;

				tile.kill();
				tile.clearGraphics();
				tile.addGraphic(anim);
			}
		});

		this.engine.clock.schedule(() => {
			fires.forEach(tile => {
				const { x, y } = tile;
				const nextTilesPositions = this.getNextFirePositionsWithWind(new Vector(x, y));

				nextTiles = [
					...new Set([
						...nextTiles,
						...nextTilesPositions.map(pos => this.wheatLayer.getTile(pos.x, pos.y))
							.filter(tile => {
								return tile && tile.getGraphics().length && !tile.isKilled();
							}),
					]),
				];
			});

			this.fireLoop(nextTiles);
		}, Config.FireLifetime / Math.abs(this.windSpeed));
	}

	private findFireCenter(objects: TiledObject[]) {
		return objects.find(obj => obj.class === Objects.FIRE.toString());
	}

	private getNextFirePositionsWithWind(currentFirePos: Vector): Vector[] {
		const { x, y } = currentFirePos;

		switch (this.wind) {
			case Wind.CALM:
				return [
					new Vector(x + 1, y),
					new Vector(x - 1, y),
					new Vector(x, y + 1),
					new Vector(x, y - 1),
					new Vector(x - 1, y - 1),
					new Vector(x - 1, y + 1),
					new Vector(x + 1, y + 1),
					new Vector(x + 1, y - 1),
				];

			case Wind.N:
				return [
					new Vector(x, y - 1),
					new Vector(x - 1, y - 1),
					new Vector(x + 1, y - 1),
				];

			case Wind.S:
				return [
					new Vector(x, y + 1),
					new Vector(x - 1, y + 1),
					new Vector(x + 1, y + 1),
				];

			case Wind.W:
				return [
					new Vector(x - 1, y),
					new Vector(x - 1, y + 1),
					new Vector(x - 1, y - 1),
				];

			case Wind.E:
				return [
					new Vector(x + 1, y),
					new Vector(x + 1, y + 1),
					new Vector(x + 1, y - 1),
				];

			case Wind.NE:
				return [
					new Vector(x + 1, y - 1),
					new Vector(x, y - 1),
					new Vector(x + 1, y),
				];

			case Wind.NW:
				return [
					new Vector(x - 1, y - 1),
					new Vector(x, y - 1),
					new Vector(x - 1, y),
				];

			case Wind.SW:
				return [
					new Vector(x - 1, y + 1),
					new Vector(x, y + 1),
					new Vector(x - 1, y),
				];

			case Wind.SE:
				return [
					new Vector(x + 1, y + 1),
					new Vector(x, y + 1),
					new Vector(x + 1, y),
				];

			default:
				return [];
		}
	}

	private rotatePlayer() {
		if (this.player?.vel) {
			const { x, y } = this.player.vel;

			if (x < 0) {
				this.player.rotation = -90 * Math.PI / 180;
				return;
			}

			if (x > 0) {
				this.player.rotation = 90 * Math.PI / 180;
				return;
			}

			if (y > 0) {
				this.player.rotation = 180 * Math.PI / 180;
				return;
			}

			if (y < 0) {
				this.player.rotation = 0;
				return;
			}
		}
	}

	private clearWheat(vec: Vector) {
		const tile = this.wheatLayer.getTileByPoint(vec);

		if (tile && tile.getGraphics().length && !tile.isKilled()) {
			tile.kill();
			tile.clearGraphics();
			tile.addGraphic(<Sprite>this.sprites.getSprite(3, 1));
		}
	}
}
