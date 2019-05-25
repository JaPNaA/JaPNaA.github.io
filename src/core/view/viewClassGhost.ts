import ViewClass from "../types/view/viewClass";
import ViewMetadata from "../types/view/viewMetadata";
import IApp from "../types/app/iApp";
import AppState from "../types/appState";
import View from "./view";

abstract class ViewClassGhost implements ViewMetadata {
    public viewName: string;
    public viewMatcher?: RegExp;

    constructor(viewName: string, matcher?: RegExp) {
        this.viewName = viewName;
        this.viewMatcher = matcher;
    }

    public abstract async getClass(): Promise<ViewClass>;

    public async create(app: IApp, appState: AppState): Promise<View> {
        return new (await this.getClass())(app, appState);
    }
}

export default ViewClassGhost;