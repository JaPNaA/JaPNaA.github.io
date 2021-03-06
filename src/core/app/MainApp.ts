import siteResources from "../siteResources";
import AppURL from "./components/AppURL";
import BaseApp from "./BaseApp";
import ResizeWatcher from "./components/ResizeWatcher";
import { Vec2 } from "../../types/math/Vec2";

abstract class MainApp extends BaseApp {
    public url: AppURL;
    public indexView?: string;
    public splashScreenView?: string;
    public autoRestoreState: boolean = true;
    public resizeWatcher: ResizeWatcher;

    constructor() {
        super();
        this.url = new AppURL(this, this.events);
        this.resizeWatcher = new ResizeWatcher();
    }

    public async setup(): Promise<void> {
        super.setup();
        this.addEventHandlers();

        this.createSplashScreen();
        this.restoreState();
        this.url.setTitle(this.title);

        document.body.appendChild(this.mainElm);
    }

    public async destory(): Promise<void> {
        this.resizeWatcher.offResize(this.resizeHandler);
        removeEventListener("keydown", this.keydownHandler);
        this.resizeWatcher.destory();
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.viewChangeHandler = this.viewChangeHandler.bind(this);
        this.beforeunloadHandler = this.beforeunloadHandler.bind(this);
        this.resizeWatcher.onResize(this.resizeHandler);
        this.events.onViewChange(this.viewChangeHandler);
        addEventListener("keydown", this.keydownHandler);
        addEventListener("beforeunload", this.beforeunloadHandler);
    }

    private resizeHandler(newSize: Vec2): void {
        this.width = newSize.x;
        this.height = newSize.y;
        this.events.dispatchResize();
    }

    private keydownHandler(event: KeyboardEvent): void {
        this.events.dispatchKeydown(event);
    }

    private viewChangeHandler(): void {
        this.views.top()?.focus();
    }

    private beforeunloadHandler(): void {
        this.url.update();
    }

    private async createSplashScreen(): Promise<void> {
        if (!this.splashScreenView) { return; }
        const SplashScreen = this.splashScreenView;
        const splashScreen = await this.views.open(SplashScreen);
        siteResources.nextDone().then(() => {
            if (splashScreen.active) {
                this.views.close(splashScreen);
            }
        });
    }

    private async restoreState(): Promise<void> {
        if (!this.autoRestoreState) { return; }
        await this.url.restoreIfShould();

        if (!this.url.restored) {
            if (this.indexView) {
                this.views.open(this.indexView);
            } else {
                this.views.open("");
            }
        }
    }
}

export default MainApp;