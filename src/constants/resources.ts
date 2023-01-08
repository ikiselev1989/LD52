import { ImageSource, Loadable } from 'excalibur';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';

type ResourceMap = Map<string, Loadable<any> | AsepriteResource | TiledMapResource>

export const BaseResources: ResourceMap = new Map();

BaseResources.set('animations', new AsepriteResource('/animations.json'));
BaseResources.set('tiles', new ImageSource('/tiles.png'));
BaseResources.set('wind', new ImageSource('/wind.png'));
BaseResources.set('tutorialMap', new TiledMapResource('/maps/tutorial.tmx'));
BaseResources.set('level1Map', new TiledMapResource('/maps/level1.tmx'));
