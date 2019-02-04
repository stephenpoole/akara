import { EntityType, EntityEvent } from './base/IEntity';
import { IGroupConfig, Group } from './Group';
import { AssetEntity } from './base/AssetEntity';
import { Entity } from './base/Entity';

export enum SceneEvent {
    Loaded = 'SceneEvent.Loaded'
}
export interface ISceneConfig extends IGroupConfig {
    name: string;
}

export class Scene extends Group {
    public type: EntityType = EntityType.Scene;
    public name: string;
    public loaded: boolean = false;
    public active: boolean = false;
    protected assetCount: number = 0;
    protected assetsLoaded: number = 0;

    public configure({
        x = 0,
        y = 0,
        z = 0,
        width = 0,
        height = 0,
        depth = 0,
        scaleX = 1,
        scaleY = 1,
        scaleZ = 1,
        pivotX = 0,
        pivotY = 0,
        alpha = 1,
        tag,
        name,
        load,
        preupdate,
        update,
        postupdate,
        start,
        destroy
    }: ISceneConfig): void {
        super.configure({
            type: EntityType.Scene,
            x,
            y,
            z,
            width,
            height,
            depth,
            scaleX,
            scaleY,
            scaleZ,
            pivotX,
            pivotY,
            tag,
            alpha,
            load,
            preupdate,
            update,
            postupdate,
            start,
            destroy
        });
        this.name = name;
        setTimeout(this.assetLoaded.bind(this), 0); // if no assets were added on next frame, trigger scene load
    }

    public add(entity: Entity): boolean {
        this.bindAsset(entity);
        return super.add(entity);
    }

    public remove(entity: Entity): boolean {
        if (entity instanceof AssetEntity) {
            entity.off(EntityEvent.Loaded, this.onEntityLoaded.bind(this));
            this.assetCount--;
            if (entity.loaded) {
                this.assetsLoaded--;
            }
        }
        return super.remove(entity);
    }

    protected bindAsset(entity: Entity): void {
        if (entity instanceof Group) {
            for (let child of entity.children) {
                this.bindAsset(child);
            }
        } else if (entity instanceof AssetEntity) {
            this.assetCount++;
            if (entity.loaded) {
                this.assetsLoaded++;
            } else {
                entity.on(EntityEvent.Loaded, this.onEntityLoaded.bind(this));
            }
        }
    }

    protected assetLoaded(entity: AssetEntity | undefined): void {
        if (typeof entity !== 'undefined') {
            this.assetsLoaded++;
        }
        if (this.assetsLoaded >= this.assetCount) {
            if (!this.loaded) {
                this.loaded = true;
                this.emit(SceneEvent.Loaded, this);
            }
        }
    }

    //#region events
    protected onEntityLoaded(entity: AssetEntity): void {
        entity.off(EntityEvent.Loaded, this.onEntityLoaded.bind(this));
        this.assetLoaded(entity);
    }
    //#endregion
}
