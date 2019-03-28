import Handler from "../../utils/events/handler";
import EventHandlers from "../../utils/events/eventHandlers";
import BaseApp from "../baseApp";
import IAppEvents from "../../types/app/iAppEvents";

class AppEvents implements IAppEvents {
    private resizeHandlers: EventHandlers;
    private viewChangeHandlers: EventHandlers;

    constructor(app: BaseApp) {
        this.resizeHandlers = new EventHandlers();
        this.viewChangeHandlers = new EventHandlers();
    }

    public onViewChange(handler: Handler): void {
        this.viewChangeHandlers.add(handler);
    }

    public offViewChange(handler: Handler): void {
        this.viewChangeHandlers.remove(handler);
    }

    public onResize(handler: Handler): void {
        this.resizeHandlers.add(handler);
    }

    public offResize(handler: Handler): void {
        this.resizeHandlers.remove(handler);
    }

    public dispatchViewChange(): void {
        this.viewChangeHandlers.dispatch();
    }

    public dispatchResize(): void {
        this.resizeHandlers.dispatch();
    }
}

export default AppEvents;