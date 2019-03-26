import Resource from "./resources/resource";
import ImageResource from "./resources/image";
import ResourceLoaderHooks from "./resourceLoaderHooks";
import EventHandlers from "../../utils/events/eventHandlers";
import OnceHandlers from "../../utils/events/onceHandlers";
import Handler from "../../utils/events/handler";
import TextResource from "./resources/text";
import JSONResource from "./resources/json";

class ResourceLoader {
    private toBeLoaded: number;
    private loaded: number;

    private resources: Map<string, Resource>;
    private hooks: ResourceLoaderHooks;

    private doneHandlers: EventHandlers;
    private doneEventOnceHandlers: OnceHandlers;

    constructor() {
        this.toBeLoaded = 0;
        this.loaded = 0;

        this.resources = new Map();
        this.hooks = new ResourceLoaderHooks(this.onLoadHandler.bind(this), this.onErrorHandler.bind(this));

        this.doneHandlers = new EventHandlers();
        this.doneEventOnceHandlers = new OnceHandlers();
    }

    public getResource(name: string): Resource | undefined {
        return this.resources.get(name);
    }

    public getProgress(): { total: number, loaded: number } {
        return { total: this.toBeLoaded, loaded: this.loaded };
    }

    public isDone(): boolean {
        return this.toBeLoaded <= this.loaded;
    }

    public onDone(handler: Handler): void {
        this.doneHandlers.add(handler);
    }

    public async nextDone(): Promise<void> {
        if (!this.isDone()) {
            await new Promise((res) => this.doneEventOnceHandlers.add(() => res()));
        }
    }

    public onDoneOnce(handler: Handler): void {
        this.doneEventOnceHandlers.add(handler);
    }

    public loadImage(path: string): ImageResource {
        const existingResource: Resource | undefined = this.resources.get(path);
        if (existingResource) {
            // converting to unkown because of bug in typescript with returning 'this type
            return existingResource as unknown as ImageResource;
        }

        const resource: ImageResource = new ImageResource(this.hooks, path);
        // converting to unkown because of bug in typescript with returning 'this type
        this.resources.set(path, resource as unknown as Resource);
        this.toBeLoaded++;
        return resource;
    }

    public loadText(path: string): TextResource {
        const existingResource: Resource | undefined = this.resources.get(path);
        if (existingResource) {
            // converting to unkown because of bug in typescript with returning 'this type
            return existingResource as unknown as TextResource;
        }

        const resource: TextResource = new TextResource(this.hooks, path);
        // converting to unkown because of bug in typescript with returning 'this type
        this.resources.set(path, resource as unknown as Resource);
        this.toBeLoaded++;
        return resource;
    }

    public loadJSON(path: string): JSONResource {
        const existingResource: Resource | undefined = this.resources.get(path);
        if (existingResource) {
            // converting to unkown because of bug in typescript with returning 'this type
            return existingResource as unknown as JSONResource;
        }

        const resource: JSONResource = new JSONResource(this.hooks, path);
        // converting to unkown because of bug in typescript with returning 'this type
        this.resources.set(path, resource as unknown as Resource);
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
        this.doneHandlers.dispatch();
        this.doneEventOnceHandlers.dispatch();
    }
}

export default ResourceLoader;