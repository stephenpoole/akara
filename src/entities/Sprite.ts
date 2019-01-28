import { Entity } from './Entity';
import { EntityType } from './IEntity';
import { Game } from './Game';
import { ImageAsset } from '../loader/assets/ImageAsset';
import { IGroupConfig } from './SuperGroup';

export interface ISpriteConfig extends IGroupConfig {}

export class Sprite extends Entity {
    public asset: ImageAsset;

    public constructor(
        game: Game,
        { x = 0, y = 0, width = 0, height = 0, scale = 1, layer = 1 }: ISpriteConfig
    ) {
        super({
            type: EntityType.Sprite,
            x,
            y,
            width,
            height,
            scale,
            layer
        });

        this.game = game;
    }

    public get image(): HTMLImageElement {
        return this.asset.getRef();
    }
}