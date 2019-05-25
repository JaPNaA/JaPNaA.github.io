import ViewClass from "../types/view/viewClass";
import ViewMetadata from "../types/view/viewMetadata";
import IApp from "../types/app/iApp";
import AppState from "../types/appState";
import View from "./view";
import ClassGhost from "../components/classGhost/classGhost";
import ClassImporterFunction from "../types/classImporterFunction";

class ViewClassGhost extends ClassGhost<View, ViewClass> implements ViewMetadata {
    public viewName: string;
    public viewMatcher?: RegExp;

    constructor(viewName: string, defaultClassImporter: ClassImporterFunction<ViewClass>, matcher?: RegExp) {
        super(viewName, defaultClassImporter);
        this.viewName = viewName;
        this.viewMatcher = matcher;
    }

    public async create(app: IApp, appState: AppState): Promise<View> {
        return new (await this.importer()).default(app, appState);
    }
}

export default ViewClassGhost;