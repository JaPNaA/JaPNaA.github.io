import Handler from "./handler";

class EventHandlers<T = void> {
    protected handlers: Handler<T>[];

    constructor() {
        this.handlers = [];
    }

    public add(handler: Handler<T>): void {
        this.handlers.push(handler);
    }

    public dispatch(data: T): void {
        for (const handler of this.handlers) {
            handler(data);
        }
    }

    public hasAny(): boolean {
        return this.handlers.length > 0;
    }
}

export default EventHandlers;