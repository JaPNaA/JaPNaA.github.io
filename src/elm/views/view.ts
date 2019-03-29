import IApp from "../../types/app/iApp";
import EventManager from "../../components/view/eventManager";

abstract class View {
    protected abstract elm: HTMLElement;

    public isFullPage: boolean;
    public viewName: string = null as any as string;
    public showGlobalWidget: boolean = true;

    protected app: IApp;
    protected events: EventManager;

    constructor(app: IApp) {
        this.app = app;
        this.events = new EventManager(app.events);
        this.isFullPage = false;
    }

    public setup(): void {
        const viewName = this.viewName || this.constructor.name;

        this.elm.classList.add("view");
        this.elm.classList.add(viewName);

        if (this.isFullPage) {
            this.app.url.register(this);
        }

        console.log("setup " + this.viewName);
    }

    /**
     * Opposite of setup.
     * @returns a promise that resolves when the scene's
     * destruction animation finishes, signifying that 
     * it's safe to remove the element.
     */
    public async destory(): Promise<void> {
        console.log("destory " + this.viewName);
        this.events.destory();
        this.elm.classList.add("destory");

        if (this.isFullPage) {
            this.app.url.unregister(this);
        }
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

    /** Updates the URL state */
    protected updateStateURL(): void {
        this.app.url.update();
    }
}

export default View;