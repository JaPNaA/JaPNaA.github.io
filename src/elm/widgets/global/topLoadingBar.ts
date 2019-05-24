import Widget from "../../../core/widget/widget";
import IApp from "../../../core/types/app/iApp";
import SiteResources from "../../../core/siteResources";
import ResourceLoaderProgress from "../../../core/types/resourceLoaderProgress";

class TopLoadingBar extends Widget {
    public static widgetName: string = "TopLoadingBar";
    public widgetName: string = TopLoadingBar.widgetName;

    // `| undefined` solves weird typescript bug because it thinks im using node
    private static transitionSpeed: number | undefined = 500;
    private static minBarLength: number = 17;

    protected elm: HTMLDivElement;
    private app: IApp;
    private lastDoneLoaded: number;
    private removeLoadingTimeout: number;

    constructor(app: IApp) {
        super();
        this.app = app;
        this.elm = document.createElement("div");
        this.lastDoneLoaded = 0;
        this.removeLoadingTimeout = -1;
    }

    public setup() {
        super.setup();
        this.addEventHandlers();
    }

    public destory() {
        super.destory();
    }

    private addEventHandlers(): void {
        SiteResources.onProgressChange(() => {
            this.setProgress(SiteResources.getProgress());
        });
    }

    private setProgress(progress: ResourceLoaderProgress): void {
        const loaded = progress.loaded - this.lastDoneLoaded;
        const total = progress.total - this.lastDoneLoaded;
        const x = loaded / total;

        this.elm.style.width = TopLoadingBar.minBarLength + (x * (100 - TopLoadingBar.minBarLength)) + "%";

        if (x < 1) {
            this.addLoading();
            this.elm.classList.remove("done");
        } else {
            this.elm.classList.add("done");
            this.removeLoadingOnTimeout();
            this.lastDoneLoaded = SiteResources.getProgress().loaded;
        }
    }

    private addLoading() {
        requestAnimationFrame(() => this.elm.classList.add("loading"));
    }

    private removeLoadingOnTimeout(): void {
        clearTimeout(this.removeLoadingTimeout);
        this.removeLoadingTimeout = setTimeout(this.removeLoading.bind(this), TopLoadingBar.transitionSpeed);
    }

    private removeLoading(): void {
        this.elm.classList.remove("loading");
    }
}

export default TopLoadingBar;