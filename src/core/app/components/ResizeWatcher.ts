import EventHandlers from "../../utils/events/EventHandlers";
import { Vec2, newVec2 } from "../../../types/math/Vec2";
import Handler from "../../utils/events/Handler";
import SiteConfig from "../../../SiteConfig";

type SizeGetter = () => [number, number];

// Because iOS

class ResizeWatcher {
    private static resizeWatchTTL: number = 120;
    // in all iOS browsers, the width and height change
    // at different times (whyyyyy)
    private static resizesAfterResize: number = 2;
    private isWatchingForResize: boolean;

    private resizePollsLeft: number;
    private resizesLeft: number;

    private width: number;
    private height: number;

    private resizeHandlers: EventHandlers<Vec2>;
    private sizeGetter: SizeGetter;

    constructor();
    constructor(sizeGetter: SizeGetter);
    constructor(sizeGetter?: SizeGetter) {
        this.sizeGetter = sizeGetter || defaultSizeGetter;

        const [width, height] = this.sizeGetter();

        this.width = width;
        this.height = height;
        this.resizePollsLeft = 0;
        this.resizesLeft = 0;
        this.isWatchingForResize = false;
        this.resizeHandlers = new EventHandlers();

        this.setup();
    }

    public destory(): void {
        removeEventListener("resize", this.resizeHandler);
    }

    /**
     * Watches for resize of the device is iOS, otherwise,
     * resize normally
     */
    public resizeOrWatch(): void {
        if (SiteConfig.isIOS) {
            this.watchForResize();
        } else {
            const [newWidth, newHeight] = this.sizeGetter();
            this.resize(newWidth, newHeight);
        }
    }

    public onResize(handler: Handler<Vec2>) {
        this.resizeHandlers.add(handler);
    }

    public offResize(handler: Handler<Vec2>) {
        this.resizeHandlers.remove(handler);
    }

    private setup(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
    }

    private resizeHandler(): void {
        this.resizeOrWatch();
    }

    private resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.resizeHandlers.dispatch(newVec2(width, height));
    }

    private didResize(): boolean {
        const [newWidth, newHeight] = this.sizeGetter();
        return newWidth !== this.width || newHeight !== this.height;
    }

    private watchForResize() {
        this.resizePollsLeft = ResizeWatcher.resizeWatchTTL;
        this.resizesLeft = ResizeWatcher.resizesAfterResize;
        if (this.isWatchingForResize) { return; }
        this.resizeWatchLoop();
    }

    private resizeWatchLoop() {
        this.resizePollsLeft--;
        this.isWatchingForResize = true;

        if (this.didResize() || this.resizePollsLeft <= 0) {
            const [newWidth, newHeight] = this.sizeGetter();
            this.resize(newWidth, newHeight);

            this.resizesLeft--;
            if (this.resizesLeft <= 0) {
                this.isWatchingForResize = false;
                return;
            }
        }

        requestAnimationFrame(() => this.resizeWatchLoop());
    }
}

function defaultSizeGetter(): [number, number] {
    return [innerWidth, innerHeight];
}

export default ResizeWatcher;