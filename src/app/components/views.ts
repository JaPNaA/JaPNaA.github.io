import ViewClass from "../../types/viewClass";
import View from "../../elm/views/view";
import BaseApp from "../baseApp";
import AppEvents from "./events";
import IAppViews from "../../types/app/iAppViews";

// handles views

class AppViews implements IAppViews {
    /** All active scenes in app */
    private activeViews: View[];

    private app: BaseApp;
    private appEvents: AppEvents;
    private mainElm: HTMLElement;

    constructor(app: BaseApp, appEvents: AppEvents, mainElm: HTMLElement) {
        this.activeViews = [];
        this.app = app;
        this.appEvents = appEvents;
        this.mainElm = mainElm;
    }

    public top(): View | undefined {
        return this.activeViews[this.activeViews.length - 1];
    }

    public switchAndInit(viewClass: ViewClass): View {
        const view: View = new viewClass(this.app);
        view.setup();
        this.switch(view);
        return view;
    }

    public switch(view: View): void {
        for (let i = this.activeViews.length - 1; i >= 0; i--) {
            const activeView = this.activeViews[i];
            this.close(activeView);
        }
        this.addBehind(view);
    }

    public open(viewClass: ViewClass): View {
        const view: View = new viewClass(this.app);
        view.setup();
        this.add(view);
        return view;
    }

    public openBehind(viewClass: ViewClass): View {
        const view: View = new viewClass(this.app);
        view.setup();
        this.add(view);
        return view;
    }

    public addBehind(view: View): void {
        view.appendAtStartTo(this.mainElm);
        this.activeViews.unshift(view);
        this.appEvents.dispatchViewChange();
    }

    public add(view: View): void {
        view.appendTo(this.mainElm);
        this.activeViews.push(view);
        this.appEvents.dispatchViewChange();
    }

    public close(view: View): void {
        const i: number = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);

        view.destory().then(() => view.removeFrom(this.mainElm));
        this.appEvents.dispatchViewChange();
    }
}

export default AppViews;