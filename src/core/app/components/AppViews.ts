import AppEvents from "./AppEvents";
import BaseApp from "../BaseApp";
import IAppViews from "../../types/app/IAppViews";
import StateData from "../../types/StateData";
import View from "../../view/View";
import ViewDescriptor from "../../types/view/ViewDescriptor";
import ViewMetadata from "../../types/view/ViewMetadata";
import createAppState from "../../utils/createAppState";
import errorToDetailedString from "../../utils/errorToDetailedString";
import ViewWithFallbackStatus from "../../types/view/ViewWithFallbackStatus";
import BeforeSetupCallback from "../../types/BeforeSetupCallback";
import NoRouteError from "../../components/router/errors/NoRouteError";

// handles views

class AppViews implements IAppViews {
    /** All active scenes in app */
    private activeViews: View[];

    private app: BaseApp;
    private appEvents: AppEvents;
    private mainElm: HTMLElement;

    private lastFullTopView: View | undefined;

    constructor(app: BaseApp, appEvents: AppEvents, mainElm: HTMLElement) {
        this.activeViews = [];
        this.app = app;
        this.appEvents = appEvents;
        this.mainElm = mainElm;
    }

    public top(): View | undefined {
        return this.activeViews[this.activeViews.length - 1];
    }

    public topFull(): View | undefined {
        for (let i = this.activeViews.length - 1; i >= 0; i--) {
            const view = this.activeViews[i];
            if (view.isFullPage) {
                return view;
            }
        }
    }

    public async switchAndInit<T extends View>(
        viewDescriptor: ViewDescriptor,
        stateData?: StateData,
        beforeSetupCallback?: BeforeSetupCallback<T>
    ): Promise<View> {
        const view = await this.createAndSetupViewWithFallbacks(viewDescriptor, stateData, beforeSetupCallback);
        this.switch(view.view);
        return view.view;
    }

    public async open<T extends View>(
        viewDescriptor: ViewDescriptor,
        stateData?: StateData,
        beforeSetupCallback?: BeforeSetupCallback<T>
    ): Promise<View> {
        const view = await this.createAndSetupViewWithFallbacks(viewDescriptor, stateData, beforeSetupCallback);
        this.add(view.view);
        return view.view;
    }

    public async openBehind<T extends View>(
        viewDescriptor: ViewDescriptor,
        stateData?: StateData,
        beforeSetupCallback?: BeforeSetupCallback<T>
    ): Promise<View> {
        const view = await this.createAndSetupViewWithFallbacks(viewDescriptor, stateData, beforeSetupCallback);
        this.addBehind(view.view);
        return view.view;
    }

    public switch(view: View): void {
        this.closeAllViews();
        this.addBehind(view);
    }

    public addBehind(view: View): void {
        view.appendAtStartTo(this.mainElm);
        this.activeViews.unshift(view);
        this.dispatchViewChange();
    }

    public add(view: View): void {
        view.appendTo(this.mainElm);
        this.activeViews.push(view);
        this.dispatchViewChange();
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

    public getById(id: number): View | undefined {
        return this.activeViews.find(view => view.id === id);
    }

    public async createAndSetupViewWithFallbacks<T extends View>(
        viewDescriptor: ViewDescriptor,
        stateData?: StateData,
        beforeSetupCallback?: BeforeSetupCallback<T>
    ): Promise<ViewWithFallbackStatus> {
        const viewWithFallbackStatus = await this.createViewWithFallbacks(viewDescriptor, stateData);

        try {
            if (beforeSetupCallback && !viewWithFallbackStatus.isFallback) {
                beforeSetupCallback(viewWithFallbackStatus.view as T);
            }
            await viewWithFallbackStatus.view.setup();
        } catch (err) {
            const view = await this.createViewCreationErrorView(err, viewDescriptor, stateData);
            view.setup();
            return { view, isFallback: true };
        }

        return viewWithFallbackStatus;
    }

    public async createViewWithFallbacks(viewDescriptor: ViewDescriptor, stateData?: StateData): Promise<ViewWithFallbackStatus> {
        let view: View;
        let isFallback: boolean;

        try {
            view = await this.createView(viewDescriptor, stateData);
            isFallback = false;
        } catch (err) {
            console.warn(err);
            isFallback = true;
            if (err instanceof NoRouteError && this.app.view404) {
                view = await this.createView(this.app.view404);
            } else {
                view = await this.createViewCreationErrorView(err, viewDescriptor, stateData);
            }
        }

        return { view, isFallback };
    }

    public async createView(
        descriptor: ViewDescriptor,
        stateData?: StateData
    ): Promise<View> {
        let viewClass;
        if (typeof descriptor === 'string') {
            viewClass = await this.app.routes.getView(descriptor);
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

    private async createViewCreationErrorView(err: any, viewDescriptor?: ViewDescriptor, state?: StateData): Promise<View> {
        if (!this.app.viewError) { throw err; }

        return await this.createView(
            this.app.viewError,
            this.generateErrorString(err, viewDescriptor, state)
        );
    }

    private generateErrorString(err: any, viewDescriptor?: ViewDescriptor, state?: StateData): string {
        let view;
        if (typeof viewDescriptor === 'string' || typeof viewDescriptor === 'undefined') {
            view = viewDescriptor;
        } else {
            view = viewDescriptor.viewName;
        }

        return errorToDetailedString(err) +
            "\nview: " + view +
            "\nstate: " + JSON.stringify(state)
    }

    private triggerClose(view: View) {
        view.destory().then(() => {
            view.removeFrom(this.mainElm);
        });
        this.dispatchViewChange();
    }

    private dispatchViewChange(): void {
        this.appEvents.dispatchViewChange();

        if (this.lastFullTopView !== this.topFull()) {
            this.appEvents.dispatchTopFullViewChange();
        }

        this.lastFullTopView = this.topFull();
    }
}

export default AppViews;