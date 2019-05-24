import IAppEvents from "../types/app/iAppEvents";
import Handler from "../utils/events/handler";
import IAppEventsMan from "../types/app/iAppEventsMan";

class EventManager implements IAppEventsMan {
    private events: IAppEvents;

    private viewChangeHandlers: Handler[];
    private resizeHandlers: Handler[];

    constructor(events: IAppEvents) {
        this.events = events;
        this.viewChangeHandlers = [];
        this.resizeHandlers = [];
    }

    public destory(): void {
        for (const handler of this.viewChangeHandlers) {
            this.events.offViewChange(handler);
        }

        for (const handler of this.resizeHandlers) {
            this.events.offResize(handler);
        }
    }

    public onViewChange(handler: Handler): void {
        this.events.onViewChange(handler);
        this.viewChangeHandlers.push(handler);
    }

    public offViewChange(handler: Handler): void {
        this.events.offViewChange(handler);
        this.viewChangeHandlers.splice(
            this.viewChangeHandlers.indexOf(handler), 1
        );
    }

    public onResize(handler: Handler): void {
        this.events.onResize(handler);
        this.resizeHandlers.push(handler);
    }

    public offResize(handler: Handler): void {
        this.events.offResize(handler);
        this.resizeHandlers.splice(
            this.viewChangeHandlers.indexOf(handler), 1
        );
    }
}

export default EventManager;