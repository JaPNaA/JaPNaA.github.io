import ResourceLoaderHooks from "../resourceLoaderHooks";
import EventHandlers from "../../../utils/events/eventHandlers";
import Handler from "../../../utils/events/handler";

abstract class Resource {
    public abstract path: string;
    public error?: Error;
    public loaded: boolean;

    private hooks: ResourceLoaderHooks;

    private loadHandlers: EventHandlers<this>;
    private errorHandlers: EventHandlers<this>;

    constructor(hooks: ResourceLoaderHooks) {
        this.hooks = hooks;
        this.loaded = false;

        this.loadHandlers = new EventHandlers();
        this.errorHandlers = new EventHandlers();
    }

    public onLoad(handler: Handler<this>): this {
        if (this.loaded) {
            handler(this);
        } else {
            this.loadHandlers.add(handler);
        }

        return this;
    }

    public onError(handler: Handler<this>): this {
        if (this.loaded) {
            handler(this);
        } else {
            this.errorHandlers.add(handler);
        }

        return this;
    }

    protected onLoadHandler(): void {
        this.loaded = true;
        this.dispatchLoadEvent();

        this.hooks.onLoad(this);
    }

    protected onErrorHandler(error: Error): void {
        this.error = error;
        this.loaded = true;
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