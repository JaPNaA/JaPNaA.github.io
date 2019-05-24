import EventHandlers from "./eventHandlers";
import Handler from "./handler";

class OnceHandlers<T = void> extends EventHandlers<T> {
    constructor() {
        super();
    }

    public dispatch(data: T): void {
        let handler: Handler<T> | undefined;
        while (handler = this.handlers.shift()) {
            handler(data);
        }
    }
}

export default OnceHandlers;