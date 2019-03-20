import Resource from "./resources/resource";
import ImageResource from "./resources/image";
import ResourceLoaderHooks from "./resourceLoaderHooks";

type Callback = () => void;

class ResourceLoader {
    private toBeLoaded: number;
    private loaded: number;

    private resources: Map<string, Resource>;
    private hooks: ResourceLoaderHooks;

    private doneEventListeners: Callback[];
    private doneOnceEventListeners: Callback[];

    constructor() {
        this.toBeLoaded = 0;
        this.loaded = 0;

        this.resources = new Map();
        this.hooks = new ResourceLoaderHooks(this.onLoadHandler.bind(this), this.onErrorHandler.bind(this));

        this.doneEventListeners = [];
        this.doneOnceEventListeners = [];
    }

    public getResource(name: string): Resource | undefined {
        return this.resources.get(name);
    }

    public getProgress(): { total: number, loaded: number } {
        return { total: this.toBeLoaded, loaded: this.loaded };
    }

    public isDone(): boolean {
        return this.toBeLoaded === this.loaded;
    }

    public onDone(handler: Callback): void {
        this.doneEventListeners.push(handler);
    }

    public async nextDone(): Promise<void> {
        if (!this.isDone()) {
            await new Promise((res) => this.doneOnceEventListeners.push(res));
        }
    }

    public onDoneOnce(handler: Callback): void {
        this.doneOnceEventListeners.push(handler);
    }

    public loadImage(path: string): ImageResource {
        const existingResource: Resource | undefined = this.resources.get(path);
        if (existingResource) {
            return existingResource as ImageResource;
        }

        const resource: ImageResource = new ImageResource(this.hooks, path);
        this.resources.set(path, resource);
        this.toBeLoaded++;
        return resource;
    }

    private onLoadHandler(): void {
        this.loaded++;
        this.checkDone();
    }

    private onErrorHandler(): void {
        this.loaded++;
        this.checkDone();
    }

    private checkDone(): void {
        if (this.isDone()) {
            this.onDoneHandler();
        }
    }

    private onDoneHandler(): void {
        for (const handler of this.doneEventListeners) {
            handler();
        }

        let handler: Callback | undefined;
        while (handler = this.doneOnceEventListeners.shift()) {
            handler();
        }
    }
}

export default ResourceLoader;