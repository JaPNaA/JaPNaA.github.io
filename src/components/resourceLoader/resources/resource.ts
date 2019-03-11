import ResourceLoaderHooks from "../resourceLoaderHooks";
import ResourceCallback from "../resourceCallback";

class Resource {
    public error?: Error;
    public loaded: boolean;

    private hooks: ResourceLoaderHooks;

    private loadHandlers: ResourceCallback[];
    private errorHandlers: ResourceCallback[];

    constructor(hooks: ResourceLoaderHooks) {
        this.hooks = hooks;
        this.loaded = false;

        this.loadHandlers = [];
        this.errorHandlers = [];
    }

    public onLoad(handler: ResourceCallback): void {
        this.loadHandlers.push(handler);
    }

    public onError(handler: ResourceCallback): void {
        this.errorHandlers.push(handler);
    }

    protected onLoadHandler(): void {
        this.loaded = true;
        this.dispatchLoadEvent();

        this.hooks.onLoad(this);
    }

    protected onErrorHandler(error: Error): void {
        this.error = error;
        this.dispathErrorEvent();

        this.hooks.onError(this);
    }

    private dispatchLoadEvent(): void {
        for (const handler of this.loadHandlers) {
            handler(this);
        }
    }

    private dispathErrorEvent(): void {
        if (this.errorHandlers.length === 0) {
            console.error("Throwing resource load error", this);
            throw new Error("Unhandled resource load error");
        }

        console.warn("Failed to load resource", this);

        for (const handler of this.errorHandlers) {
            handler(this);
        }
    }
}

export default Resource;