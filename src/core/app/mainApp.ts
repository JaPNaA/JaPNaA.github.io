import ViewDescriptor from "../types/app/viewDescriptor";
import SiteResources from "../siteResources";
import AppURL from "./components/url";
import BaseApp from "./baseApp";

abstract class MainApp extends BaseApp {
    public url: AppURL;
    public indexView?: ViewDescriptor;
    public splashScreenView?: ViewDescriptor;
    public autoRestoreState: boolean = true;

    constructor() {
        super();
        this.url = new AppURL(this, this.events);
    }

    public async setup(): Promise<void> {
        super.setup();
        this.addEventHandlers();

        this.createSplashScreen();
        this.restoreState();
        this.url.setTitle(this.title);

        document.body.appendChild(this.mainElm);
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
        this.keydownHandler = this.keydownHandler.bind(this);
        addEventListener("keydown", this.keydownHandler);
    }

    private resizeHandler(): void {
        // TODO: Handle IOS resizes
        this.width = innerWidth;
        this.height = innerHeight;
        this.events.dispatchResize();
    }

    private keydownHandler(event: KeyboardEvent): void {
        this.events.dispatchKeydown(event);
    }

    private async createSplashScreen(): Promise<void> {
        if (!this.splashScreenView) { return; }
        const splashScreen = await this.views.open(this.splashScreenView);
        SiteResources.nextDone().then(() => {
            if (splashScreen) {
                this.views.close(splashScreen);
            }
        });
    }

    private async restoreState(): Promise<void> {
        if (!this.autoRestoreState) { return; }
        await this.url.restoreIfShould();

        if (!this.url.restored && this.indexView) {
            this.views.open(this.indexView);
        }
    }
}

export default MainApp;