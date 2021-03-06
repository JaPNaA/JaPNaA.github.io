import Handler from "./Handler";

class EventHandlers<T = void> {
    protected handlers: Handler<T>[];

    constructor() {
        this.handlers = [];
    }

    public add(handler: Handler<T>): void {
        this.handlers.push(handler);
    }

    public remove(handler: Handler<T>): void {
        const i = this.handlers.indexOf(handler);
        if (i < 0) { throw new Error("Removing handler that doesn't exist"); }
        this.handlers.splice(i, 1);
    }

    public dispatch(data: T): void {
        for (let i = this.handlers.length - 1; i >= 0; i--) {
            this.handlers[i](data);
        }
    }

    public hasAny(): boolean {
        return this.handlers.length > 0;
    }
}

export default EventHandlers;