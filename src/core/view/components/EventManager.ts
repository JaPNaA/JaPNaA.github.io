import IAppEvents from "../../types/app/IAppEvents";
import Handler from "../../utils/events/Handler";
import IAppEventsMan from "../../types/app/IAppEventsMan";
import siteConfig from "../../../SiteConfig";

class EventManager implements IAppEventsMan {
    private events: IAppEvents;

    private viewChangeHandlers: Handler[];
    private topViewChangeHandler: Handler[];
    private resizeHandlers: Handler[];
    private keydownHandlers: Handler<KeyboardEvent>[];
    private settingsChangeHandlers: Handler[];

    constructor(events: IAppEvents) {
        this.events = events;
        this.viewChangeHandlers = [];
        this.topViewChangeHandler = [];
        this.resizeHandlers = [];
        this.keydownHandlers = [];
        this.settingsChangeHandlers = [];
    }

    public destory(): void {
        for (const handler of this.viewChangeHandlers) {
            this.events.offViewChange(handler);
        }

        for (const handler of this.topViewChangeHandler) {
            this.events.offTopFullViewChange(handler);
        }

        for (const handler of this.resizeHandlers) {
            this.events.offResize(handler);
        }

        for (const handler of this.keydownHandlers) {
            this.events.offKeydown(handler);
        }

        for (const handler of this.settingsChangeHandlers) {
            siteConfig.offSettingsChanged(handler);
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

    public onTopFullViewChange(handler: Handler): void {
        this.events.onTopFullViewChange(handler);
    }

    public offTopFullViewChange(handler: Handler): void {
        this.events.offTopFullViewChange(handler);
        this.topViewChangeHandler.splice(
            this.topViewChangeHandler.indexOf(handler), 1
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

    public onKeydown(handler: Handler<KeyboardEvent>): void {
        this.events.onKeydown(handler);
        this.keydownHandlers.push(handler);
    }

    public offKeydown(handler: Handler<KeyboardEvent>): void {
        this.events.offKeydown(handler);
        this.keydownHandlers.splice(
            this.keydownHandlers.indexOf(handler), 1
        );
    }

    public onSettingsChange(handler: Handler): void {
        siteConfig.onSettingsChanged(handler);
        this.settingsChangeHandlers.push(handler);
    }

    public offSettingsChange(handler: Handler): void {
        siteConfig.offSettingsChanged(handler);
        this.settingsChangeHandlers.splice(
            this.settingsChangeHandlers.indexOf(handler), 1
        );
    }
}

export default EventManager;