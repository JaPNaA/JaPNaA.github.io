import Handler from "../../utils/events/Handler";
import EventHandlers from "../../utils/events/EventHandlers";
import IAppEvents from "../../types/app/IAppEvents";
import BaseApp from "../BaseApp";

class AppEvents implements IAppEvents {
    private resizeHandlers: EventHandlers;
    private viewChangeHandlers: EventHandlers;
    private keydownHandlers: EventHandlers<KeyboardEvent>
    private topViewFullChangeHandlers: EventHandlers;

    constructor(app: BaseApp) {
        this.resizeHandlers = new EventHandlers();
        this.viewChangeHandlers = new EventHandlers();
        this.keydownHandlers = new EventHandlers();
        this.topViewFullChangeHandlers = new EventHandlers();
    }

    public onViewChange(handler: Handler): void {
        this.viewChangeHandlers.add(handler);
    }

    public offViewChange(handler: Handler): void {
        this.viewChangeHandlers.remove(handler);
    }

    public onTopFullViewChange(handler: Handler): void {
        this.topViewFullChangeHandlers.add(handler);
    }

    public offTopFullViewChange(handler: Handler): void {
        this.topViewFullChangeHandlers.remove(handler);
    }

    public onResize(handler: Handler): void {
        this.resizeHandlers.add(handler);
    }

    public offResize(handler: Handler): void {
        this.resizeHandlers.remove(handler);
    }

    public onKeydown(handler: Handler<KeyboardEvent>): void {
        this.keydownHandlers.add(handler);
    }

    public offKeydown(handler: Handler<KeyboardEvent>): void {
        this.keydownHandlers.remove(handler);
    }

    public dispatchViewChange(): void {
        this.viewChangeHandlers.dispatch();
    }

    public dispatchTopFullViewChange(): void {
        this.topViewFullChangeHandlers.dispatch();
    }

    public dispatchResize(): void {
        this.resizeHandlers.dispatch();
    }

    public dispatchKeydown(data: KeyboardEvent): void {
        this.keydownHandlers.dispatch(data);
    }
}

export default AppEvents;