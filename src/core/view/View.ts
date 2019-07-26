import IApp from "../types/app/IApp";
import EventManager from "./components/EventManager";
import EventHandlers from "../utils/events/EventHandlers";
import Handler from "../utils/events/Handler";
import AppState from "../types/AppState";

abstract class View {
    private static vidCounter = 0;

    protected abstract elm: HTMLElement;

    public isFullPage: boolean = false;
    public viewName: string = null as any as string;
    public showMenuButton: boolean = true;

    public id: number;
    public privateData: any;

    protected app: IApp;
    protected events: EventManager;
    private destoryHandlers: EventHandlers;

    constructor(app: IApp, state: AppState) {
        this.app = app;
        this.events = new EventManager(app.events);
        this.destoryHandlers = new EventHandlers();

        this.id = state.id || View.vidCounter++;
        this.privateData = state.privateData;
    }

    public setup(): void {
        this.viewName = this.viewName || this.constructor.name;
        this.elm.classList.add("view");
        this.elm.classList.add(this.viewName);

        if (this.isFullPage) {
            this.app.url.pushHistory(this);
        }

        this.app.focus();
    }

    /**
     * Opposite of setup.
     * @returns a promise that resolves when the scene's
     * destruction animation finishes, signifying that 
     * it's safe to remove the element.
     */
    public async destory(): Promise<void> {
        this.destoryHandlers.dispatch();
        this.events.destory();
        this.elm.classList.add("destory");
    }

    /** Appends scene element to element */
    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    /** Appends scene to element as first child */
    public appendAtStartTo(parent: HTMLElement) {
        parent.insertBefore(this.elm, parent.firstChild);
    }

    /** Removes scene element from element */
    public removeFrom(parent: HTMLElement) {
        parent.removeChild(this.elm);
    }

    /** Returns if the view can be scrolled */
    public canScroll(): boolean {
        return this.elm.scrollHeight > this.elm.clientHeight;
    }

    /** Gets the view state for the URL */
    public getState(): string | undefined { return; }

    /** Add destory handler */
    public onDestory(handler: Handler): void {
        this.destoryHandlers.add(handler);
    }

    /** Remove destory handler */
    public offDestory(handler: Handler): void {
        this.destoryHandlers.remove(handler);
    }

    /** Updates the URL state */
    protected updateStateURL(): void {
        this.app.url.update();
    }
}

export default View;