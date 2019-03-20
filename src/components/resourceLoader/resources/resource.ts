import ResourceLoaderHooks from "../resourceLoaderHooks";
import EventHandlers from "../../../utils/events/eventHandlers";
import Handler from "../../../utils/events/handler";

class Resource {
    public error?: Error;
    public loaded: boolean;

    private hooks: ResourceLoaderHooks;

    private loadHandlers: EventHandlers<Resource>;
    private errorHandlers: EventHandlers<Resource>;

    constructor(hooks: ResourceLoaderHooks) {
        this.hooks = hooks;
        this.loaded = false;

        this.loadHandlers = new EventHandlers();
        this.errorHandlers = new EventHandlers();
    }

    public onLoad(handler: Handler<Resource>): void {
        this.loadHandlers.add(handler);
    }

    public onError(handler: Handler<Resource>): void {
        this.errorHandlers.add(handler);
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
        this.loadHandlers.dispatch(this);
    }

    private dispathErrorEvent(): void {
        if (!this.errorHandlers.hasAny()) {
            console.error("Throwing resource load error", this);
            throw new Error("Unhandled resource load error");
        }

        console.warn("Failed to load resource", this);

        this.errorHandlers.dispatch(this);
    }
}

export default Resource;