import View from "./elm/views/view";
import ViewClass from "./types/viewClass";
import EventHandlers from "./utils/events/eventHandlers";
import Handler from "./utils/events/handler";
import IApp from "./types/app";
import IURLMan from "./components/url/iUrlMan";

abstract class BaseApp implements IApp {
    public width: number;
    public height: number;

    /** Url manager for app */
    public abstract url: IURLMan;
    /** EventHandlers for resize */
    protected abstract resizeHandlers: EventHandlers;
    /** Main element app lives in */
    protected mainElm: HTMLDivElement;
    /** All active scenes in app */
    private activeViews: View[];

    private viewChangeHandlers: EventHandlers;

    constructor() {
        this.width = innerWidth;
        this.height = innerHeight;

        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");

        this.activeViews = [];
        this.viewChangeHandlers = new EventHandlers();
    }

    public async setup(): Promise<void> {
        console.log("setup BaseApp");
    }

    public async destory(): Promise<void> {
        console.log("destory BaseApp");
    }

    public getTopView(): View | undefined {
        return this.activeViews[this.activeViews.length - 1];
    }

    public switchAndInitView(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        this.switchView(view);
        return view;
    }

    public switchView(view: View): void {
        for (const activeView of this.activeViews) {
            this.closeView(activeView);
        }
        this.addViewBehind(view);
    }

    public openView(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        this.addView(view);
        return view;
    }

    public openViewBehind(viewClass: ViewClass): View {
        const view: View = new viewClass(this);
        view.setup();
        this.addView(view);
        return view;
    }

    public addViewBehind(view: View): void {
        view.appendAtStartTo(this.mainElm);
        this.activeViews.unshift(view);
        this.dispatchViewChange();
    }

    public addView(view: View): void {
        view.appendTo(this.mainElm);
        this.activeViews.push(view);
        this.dispatchViewChange();
    }

    public closeView(view: View): void {
        const i: number = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);

        view.destory().then(() => view.removeFrom(this.mainElm));
        this.dispatchViewChange();
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

    private dispatchViewChange(): void {
        this.viewChangeHandlers.dispatch();
    }
}

export default BaseApp;