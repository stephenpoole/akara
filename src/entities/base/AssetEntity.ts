import { Entity } from './Entity';
import { IEntityConfig, EntityEvents, IEntity } from './IEntity';
import { Asset, AssetType } from '../../loader/assets/Asset';
import { Game } from '../Game';
import { LoaderEvents } from '../../loader/Loader';
import { EmptyAsset } from '../../loader/assets/EmptyAsset';

export interface IAssetEntity extends IEntity {
    load?: Function;
}

export interface IAssetEntityConfig extends IEntityConfig {
    asset: string;
    assetType: AssetType;
    load?: Function;
}

export class AssetEntity extends Entity implements IAssetEntity {
    public asset: Asset;
    private assetType: AssetType;
    private assetName: string;

    public constructor(
        game: Game,
        {
            type,
            assetType,
            asset,
            x = 0,
            y = 0,
            z = 0,
            width = 0,
            height = 0,
            scale = 1,
            load,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        }: IAssetEntityConfig
    ) {
        super({
            type,
            x,
            y,
            z,
            width,
            height,
            scale,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
        this.assetType = assetType;
        this.assetName = asset;
        this.game = game;
        this.bindAsset();
        this.initialize({ load, update, preupdate, postupdate, start, destroy });
    }

    protected initialize({ load, update, preupdate, postupdate, start, destroy }): void {
        this.bind('load', load);
        this.bind('update', update);
        this.bind('preupdate', preupdate);
        this.bind('postupdate', postupdate);
        this.bind('start', start);
        this.bind('destroy', destroy);
    }

    private bindAsset(): void {
        const loader = this.game.load;
        const asset = loader.get(this.assetType, this.assetName);
        const engine = this.game.engine;

        if (!!asset) {
            this.asset = asset;
            if (asset.loaded) {
                this.onAssetLoaded(this.asset);
            } else {
                loader.on(LoaderEvents.Load, this.onAssetLoaded.bind(this));

                if (engine.started) {
                    this.asset.load();
                }
            }
        } else {
            this.asset = new EmptyAsset();
            loader.on(LoaderEvents.Add, this.onAssetAdded.bind(this));
        }
    }

    public get hasAsset(): boolean {
        return !!this.asset;
    }

    public get loaded(): boolean {
        return this.asset.loaded;
    }

    //#region events
    protected onAssetLoaded(asset: Asset): void {
        if (asset.equals(this.asset)) {
            this.call('load');
            this.emit(EntityEvents.Loaded, this);
            this.game.load.off(LoaderEvents.Load, this.onAssetLoaded.bind(this));
        }
    }

    protected onAssetAdded(asset: Asset): void {
        if (asset.type === this.assetType && asset.name === this.assetName) {
            this.asset = asset;
            this.game.load.off(LoaderEvents.Add, this.onAssetAdded.bind(this));

            if (asset.loaded) {
                this.emit(EntityEvents.Loaded, this);
            } else {
                this.game.load.on(LoaderEvents.Load, this.onAssetLoaded.bind(this));
            }
        }
    }
    //#endregion
}
