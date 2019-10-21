import Widget from "../../../core/widget/Widget";
import IApp from "../../../core/types/app/IApp";
import siteResources from "../../../core/siteResources";
import ResourceLoaderProgress from "../../../core/types/ResourceLoaderProgress";

class TopLoadingBar extends Widget {
    public static cssName: string = "TopLoadingBar";
    public cssName: string = TopLoadingBar.cssName;

    private static transitionSpeed: number = 500;
    private static timeToIdle: number = 100;
    private static timeToWaitBeforeSetLoading: number = 25;

    private static minBarLength: number = 17;

    protected elm: HTMLDivElement;
    private app: IApp;

    private lastDoneLoaded: number;
    private lastProgress: number;

    private markDoneTimeout: number;
    private markLoadingTimeout: number;

    constructor(app: IApp) {
        super();
        this.app = app;
        this.elm = document.createElement("div");

        this.lastDoneLoaded = 0;
        this.lastProgress = 0;

        this.markDoneTimeout = -1;
        this.markLoadingTimeout = -1;
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
        const displayProgress = loaded / (total + 3);

        if (displayProgress >= this.lastProgress) {
            this.elm.style.width = TopLoadingBar.minBarLength + (displayProgress * (100 - TopLoadingBar.minBarLength)) + "%";
            this.lastProgress = displayProgress;
        }

        if (progress < 1) {
            this.waitThenMarkLoading();
        } else {
            this.waitThenMarkDone();
        }
    }

    private waitThenMarkLoading() {
        this.cancelMarkDone();

        if (this.markLoadingTimeout < 0) {
            this.markLoadingTimeout = window.setTimeout(
                this.markLoading.bind(this),
                TopLoadingBar.timeToWaitBeforeSetLoading
            );
        }
    }

    private waitThenMarkDone(): void {
        this.cancelMarkDone();
        this.cancelMarkLoading();

        this.markDoneTimeout = window.setTimeout(
            this.markDone.bind(this),
            TopLoadingBar.timeToIdle
        );
    }

    private markLoading(): void {
        this.elm.classList.remove("done");
        this.elm.classList.add("loading");
    }

    private markDone(): void {
        this.elm.style.width = "100%";
        this.lastProgress = 0;

        requestAnimationFrame(() => requestAnimationFrame(() => {
            this.elm.classList.add("done");

            window.setTimeout(() => {
                this.elm.classList.remove("loading");
                this.elm.style.width = "0";
                this.lastDoneLoaded = siteResources.getProgress().loaded;
            }, TopLoadingBar.transitionSpeed);
        }));
    }

    private cancelMarkDone(): void {
        clearTimeout(this.markDoneTimeout);
        this.markDoneTimeout = -1;
    }

    private cancelMarkLoading(): void {
        clearTimeout(this.markLoadingTimeout);
        this.markLoadingTimeout = -1;
    }
}

export default TopLoadingBar;