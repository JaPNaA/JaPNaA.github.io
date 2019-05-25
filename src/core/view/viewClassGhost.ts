import ViewClass from "../types/view/viewClass";
import ViewMetadata from "../types/view/viewMetadata";
import IApp from "../types/app/iApp";
import AppState from "../types/appState";
import View from "./view";
import SiteResources from "../siteResources";

type GetClassFunction = () => Promise<{ default: ViewClass }>;

class ViewClassGhost implements ViewMetadata {
    public viewName: string;
    public viewMatcher?: RegExp;
    public importer: GetClassFunction;

    constructor(viewName: string, defaultClassImporter: GetClassFunction, matcher?: RegExp) {
        this.viewName = viewName;
        this.viewMatcher = matcher;
        this.importer = defaultClassImporter;
    }

    public async getClass(): Promise<ViewClass> {
        console.log("Loading view " + this.viewName);
        SiteResources.addResourceLoading();
        const viewClass = (await this.importer()).default;
        SiteResources.addResourceLoaded();
        return viewClass;
    }

    public async create(app: IApp, appState: AppState): Promise<View> {
        return new (await this.importer()).default(app, appState);
    }
}

export default ViewClassGhost;