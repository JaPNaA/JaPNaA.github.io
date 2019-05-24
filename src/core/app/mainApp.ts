import BaseApp from "./baseApp";
import AppURL from "./components/url";
import ViewClass from "../types/viewClass";
import SiteResources from "../siteResources";

abstract class MainApp extends BaseApp {
    public url: AppURL;
    public indexView?: ViewClass;
    public splashScreenView?: ViewClass;
    public autoRestoreState: boolean = true;

    constructor() {
        super();
        this.url = new AppURL(this, this.events);
    }

    public async setup(): Promise<void> {
        super.setup();
        this.addResizeEventHandler();

        this.createSplashScreen();
        this.restoreState();

        document.body.appendChild(this.mainElm);
    }

    private addResizeEventHandler() {
        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
    }

    private resizeHandler() {
        this.width = innerWidth;
        this.height = innerHeight;
        this.events.dispatchResize();
    }

    private createSplashScreen() {
        if (!this.splashScreenView) { return; }
        const splashScreen = this.views.open(this.splashScreenView);
        SiteResources.nextDone().then(() => {
            if (splashScreen) {
                this.views.close(splashScreen);
            }
        });
    }

    private restoreState() {
        if (!this.autoRestoreState) { return; }
        this.url.restoreIfShould();

        if (!this.url.restored && this.indexView) {
            this.views.open(this.indexView);
        }
    }
}

export default MainApp;