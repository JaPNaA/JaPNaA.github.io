import ViewClass from "../../types/viewClass";
import View from "../../elm/views/view";
import BaseApp from "../baseApp";
import AppEvents from "./events";
import IAppViews from "../../types/app/iAppViews";
import createViewState from "../../utils/createViewState";

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

    public firstFullTop(): View | undefined {
        for (let i = this.activeViews.length - 1; i >= 0; i--) {
            const view = this.activeViews[i];
            if (view.isFullPage) {
                return view;
            }
        }
    }

    public switchAndInit(viewClass: ViewClass, stateData?: string): View {
        const view = this.createViewWithStatedata(viewClass, stateData);
        view.setup();
        this.switch(view);
        return view;
    }

    public open(viewClass: ViewClass, stateData?: string): View {
        const view = this.createViewWithStatedata(viewClass, stateData);
        view.setup();
        this.add(view);
        return view;
    }

    public openBehind(viewClass: ViewClass, stateData?: string): View {
        const view = this.createViewWithStatedata(viewClass, stateData);
        view.setup();
        this.addBehind(view);
        return view;
    }

    public switch(view: View): void {
        this.closeAllViews();
        this.addBehind(view);
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

    public closeAllViews(): void {
        for (const view of this.activeViews) {
            this.triggerClose(view);
        }
        this.activeViews.length = 0;
    }

    public close(view: View): void {
        const i: number = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);
        this.triggerClose(view);
    }

    public getA(viewClass: ViewClass): View | undefined {
        return this.activeViews.find(e => e instanceof viewClass);
    }

    private triggerClose(view: View) {
        view.destory().then(() => {
            view.removeFrom(this.mainElm);
        });
        this.appEvents.dispatchViewChange();
    }

    private createViewWithStatedata(viewClass: ViewClass, stateData?: string): View {
        return new viewClass(this.app, createViewState(viewClass, stateData));
    }
}

export default AppViews;