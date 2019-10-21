import IApp from "../types/app/IApp";
import EventManager from "./components/EventManager";
import EventHandlers from "../utils/events/EventHandlers";
import Handler from "../utils/events/Handler";
import AppState from "../types/AppState";
import ViewComponent from "./ViewComponent";

abstract class View {
    private static vidCounter = 0;

    protected abstract elm: HTMLElement;

    public isFullPage: boolean = false;
    public cssName!: string;
    public viewPath: string;
    public showMenuButton: boolean = true;

    public id: number;
    public active: boolean;

    protected privateData: any;
    protected app: IApp;
    protected events: EventManager;
    protected viewComponents: ViewComponent[];

    private destoryHandlers: EventHandlers;

    constructor(app: IApp, state: AppState) {
        this.app = app;
        this.events = new EventManager(app.events);
        this.destoryHandlers = new EventHandlers();

        this.viewPath = this.app.routes.fixViewPath(state.viewPath);

        this.id = state.id || View.vidCounter++;
        this.active = false;
        this.privateData = state.privateData || {};
        this.viewComponents = [];
    }

    public setup(): void {
        this.elm.classList.add("view");
        this.elm.classList.add(this.cssName);

        if (this.isFullPage) {
            this.app.url.pushHistory(this);
        }

        for (const component of this.viewComponents) {
            component.setup();
        }

        this.app.focus();
        this.active = true;
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

        for (const component of this.viewComponents) {
            component.destory();
        }

        this.active = false;
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

    /** Gets the view's title */
    public getTitle(): string | undefined { return; }

    /** Gets the view state for the URL */
    public getState(): string | undefined { return; }

    /** Sets the view's state from URL. Returns true if succeeds */
    public setState(state: string | undefined): boolean { return false; }

    /** Gets the private data for view */
    public getPrivateData(): any {
        for (const component of this.viewComponents) {
            component.updatePrivateData();
        }

        return this.privateData;
    }

    /** Add destory handler */
    public onDestory(handler: Handler): void {
        this.destoryHandlers.add(handler);
    }

    /** Remove destory handler */
    public offDestory(handler: Handler): void {
        this.destoryHandlers.remove(handler);
    }

    /** Updates the URL state */
    protected updateState(): void {
        this.app.url.update();
    }
}

export default View;