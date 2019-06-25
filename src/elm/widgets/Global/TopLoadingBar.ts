import Widget from "../../../core/widget/Widget";
import IApp from "../../../core/types/app/IApp";
import siteResources from "../../../core/siteResources";
import ResourceLoaderProgress from "../../../core/types/ResourceLoaderProgress";

class TopLoadingBar extends Widget {
    public static widgetName: string = "TopLoadingBar";
    public widgetName: string = TopLoadingBar.widgetName;

    // `| undefined` solves weird typescript bug because it thinks im using node
    private static transitionSpeed: number | undefined = 500;
    private static minBarLength: number = 17;

    protected elm: HTMLDivElement;
    private app: IApp;
    private lastDoneLoaded: number;
    private lastProgress: number;
    private removeLoadingTimeout: number;

    constructor(app: IApp) {
        super();
        this.app = app;
        this.elm = document.createElement("div");
        this.lastDoneLoaded = 0;
        this.lastProgress = 0;
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
        siteResources.onProgressChange(() => {
            this.setProgress(siteResources.getProgress());
        });
    }

    private setProgress(progressData: ResourceLoaderProgress): void {
        const loaded = progressData.loaded - this.lastDoneLoaded;
        const total = progressData.total - this.lastDoneLoaded;
        const progress = loaded / total;
        const displayProgress = loaded / (total + 1);

        if (displayProgress >= this.lastProgress) {
            this.elm.style.width = TopLoadingBar.minBarLength + (displayProgress * (100 - TopLoadingBar.minBarLength)) + "%";
            this.lastProgress = displayProgress;
        }

        if (progress < 1) {
            this.addLoading();
            this.elm.classList.remove("done");
        } else {
            this.elm.classList.add("done");
            this.removeLoadingOnTimeout();
            this.lastDoneLoaded = siteResources.getProgress().loaded;
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
        this.elm.style.width = "0";
        this.lastProgress = 0;
    }
}

export default TopLoadingBar;