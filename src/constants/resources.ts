import { ImageSource, Loadable } from 'excalibur';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

type ResourceMap = Map<string, Loadable<any> | AsepriteResource>

export const BaseResources: ResourceMap = new Map();

BaseResources.set('animations', new AsepriteResource('/animations.json'));
BaseResources.set('tiles', new ImageSource('/tiles.png'));
