import AppEvents from "./events";
import IAppURL from "../../types/app/iAppURL";
import URLController from "../../components/url/urlController";
import BaseApp from "../baseApp";

class AppURL implements IAppURL {
    public restoredFromRedirect: boolean = false;

    private app: BaseApp;
    private appEvents: AppEvents;

    private controller: URLController;
    private isFake: boolean = false;

    constructor(app: BaseApp, appEvents: AppEvents) {
        this.app = app;
        this.appEvents = appEvents;
        this.controller = new URLController();
    }

    public setFake() {
        this.isFake = true;
    }

    public restoreIfShould(): void {
        if (this.isFake) { return; }
        this.controller.restoreIfShould(this.app);
    }

    public setState(viewName: string, stateData: string) {
        if (this.isFake) { return; }
        this.controller.setState(viewName, stateData);
    }

    public pushState(viewName: string, stateData: string) {
        if (this.isFake) { return; }
        this.controller.pushState(viewName, stateData);
    }
}

export default AppURL;