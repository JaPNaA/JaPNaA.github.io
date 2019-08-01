import View from "../../view/View";
import ViewMap from "../../view/ViewMap";
import ViewMetadata from "../../types/view/ViewMetadata";
import IAppViews from "../../types/app/IAppViews";
import AppState from "../../types/AppState";
import ViewDescriptor from "../../types/app/ViewDescriptor";
import createAppState from "../../utils/createAppState";
import BaseApp from "../BaseApp";
import AppEvents from "./AppEvents";

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

    public async switchAndInit(viewDescriptor: ViewDescriptor, stateData?: string | AppState): Promise<View> {
        const view = await this.createViewWithStatedata(viewDescriptor, stateData);
        view.setup();
        this.switch(view);
        return view;
    }

    public async open(viewDescriptor: ViewDescriptor, stateData?: string | AppState): Promise<View> {
        const view = await this.createViewWithStatedata(viewDescriptor, stateData);
        view.setup();
        this.add(view);
        return view;
    }

    public async openBehind(viewDescriptor: ViewDescriptor, stateData?: string | AppState): Promise<View> {
        const view = await this.createViewWithStatedata(viewDescriptor, stateData);
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

    public closeAllViewsExcept(execption: View): void {
        for (const view of this.activeViews) {
            if (view === execption) { continue; }
            this.close(view);
        }
    }

    public close(view: View): void {
        const i: number = this.activeViews.indexOf(view);
        if (i < 0) { throw new Error("Attempt to remove view not in activeViews"); }
        this.activeViews.splice(i, 1);
        this.triggerClose(view);
    }

    public getA(viewClass: ViewMetadata | string): View | undefined {
        if (typeof viewClass === 'string') {
            return this.activeViews.find(e => viewClass === e.viewName);
        } else {
            return this.activeViews.find(e => viewClass.viewName === e.viewName);
        }
    }

    private triggerClose(view: View) {
        view.destory().then(() => {
            view.removeFrom(this.mainElm);
        });
        this.appEvents.dispatchViewChange();
    }

    private async createViewWithStatedata(
        descriptor: ViewDescriptor,
        stateData?: string | AppState
    ): Promise<View> {
        let viewClass;
        if (typeof descriptor === 'string') {
            viewClass = await ViewMap.get(descriptor);
        } else {
            viewClass = descriptor;
        }

        let appState;
        if (typeof stateData === 'string' || stateData === undefined) {
            appState = createAppState(viewClass, stateData);
        } else {
            appState = stateData;
        }

        return new viewClass(this.app, appState);
    }
}

export default AppViews;