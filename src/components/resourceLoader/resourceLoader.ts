import Resource from "./resources/resource";
import ImageResource from "./resources/image";
import ResourceLoaderHooks from "./resourceLoaderHooks";
import EventHandlers from "../../utils/events/eventHandlers";
import OnceHandlers from "../../utils/events/onceHandlers";
import Handler from "../../utils/events/handler";
import TextResource from "./resources/text";
import JSONResource from "./resources/json";
import XMLResource from "./resources/xml";
import ResourceLoaderProgress from "../../types/resourceLoaderProgress";

type ResourceClass<T> = new (hooks: ResourceLoaderHooks, path: string, ...additionalArgs: any[]) => T;

class ResourceLoader {
    private toBeLoaded: number;
    private loaded: number;

    private resources: Map<string, Resource>;
    private hooks: ResourceLoaderHooks;

    private doneHandlers: EventHandlers;
    private doneEventOnceHandlers: OnceHandlers;
    private newResourceHandlers: EventHandlers<Resource | undefined>;
    private progressChange: EventHandlers;

    constructor() {
        this.toBeLoaded = 0;
        this.loaded = 0;

        this.resources = new Map();
        this.hooks = new ResourceLoaderHooks(this.onLoadHandler.bind(this), this.onErrorHandler.bind(this));

        this.newResourceHandlers = new EventHandlers();
        this.doneHandlers = new EventHandlers();
        this.doneEventOnceHandlers = new OnceHandlers();
        this.progressChange = new EventHandlers();
    }

    public getResource(name: string): Resource | undefined {
        return this.resources.get(name);
    }

    public getProgress(): ResourceLoaderProgress {
        return { total: this.toBeLoaded, loaded: this.loaded, num: this.loaded / this.toBeLoaded };
    }

    public onNewResource(handler: Handler<Resource | undefined>): void {
        this.newResourceHandlers.add(handler);
    }

    public offNewResource(handler: Handler<Resource | undefined>): void {
        this.newResourceHandlers.remove(handler);
    }

    public isDone(): boolean {
        return this.toBeLoaded <= this.loaded;
    }

    public onDone(handler: Handler): void {
        this.doneHandlers.add(handler);
    }

    public offDone(handler: Handler): void {
        this.doneHandlers.remove(handler);
    }

    public async nextDone(): Promise<void> {
        if (!this.isDone()) {
            await new Promise((res) => this.doneEventOnceHandlers.add(() => res()));
        }
    }

    public onDoneOnce(handler: Handler): void {
        this.doneEventOnceHandlers.add(handler);
    }

    public onProgressChange(handler: Handler): void {
        this.progressChange.add(handler);
    }

    public offProgressChange(handler: Handler): void {
        this.progressChange.remove(handler);
    }

    public loadImage(path: string): ImageResource {
        return this.loadResource<ImageResource>(path, ImageResource);
    }

    public loadText(path: string): TextResource {
        return this.loadResource<TextResource>(path, TextResource);
    }

    public loadJSON(path: string): JSONResource {
        return this.loadResource<JSONResource>(path, JSONResource);
    }

    public loadXML(path: string, type?: SupportedType): XMLResource {
        return this.loadResource<XMLResource>(path, XMLResource, type);
    }

    /** For anything else that loads, but cannot be used with ResourceLoader */
    public addResourceLoading(): void {
        this.toBeLoaded++;
        this.newResourceHandlers.dispatch(undefined);
    }

    /** For anything else that loads, but cannot be used with ResourceLoader */
    public addResourceLoaded(): void {
        this.onLoadHandler();
    }

    public deleteResource(path: string): boolean {
        if (this.resources.has(path)) {
            this.resources.delete(path);
            return true;
        }
        return false;
    }

    private loadResource<T>(path: string, tconstructor: ResourceClass<T>, ...additionalArgs: any[]): T {
        const existingResource: Resource | undefined = this.resources.get(path);
        if (existingResource) {
            // converting to unkown because of bug in typescript with returning 'this type
            return existingResource as any as T;
        }

        const resource: T = new tconstructor(this.hooks, path, ...additionalArgs);
        // converting to unkown because of bug in typescript with returning 'this type
        this.resources.set(path, resource as any as Resource);
        this.toBeLoaded++;
        this.newResourceHandlers.dispatch(resource as any as Resource);
        this.progressChange.dispatch();
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
        this.progressChange.dispatch();
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