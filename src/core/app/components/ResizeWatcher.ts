import EventHandlers from "../../utils/events/eventHandlers";
import { Vec2, newVec2 } from "../../../types/math/vec2";
import Handler from "../../utils/events/handler";

type SizeGetter = () => [number, number];

// Because iOS

class ResizeWatcher {
    private static resizeWatchTTL: number = 120;
    private isWatchingForResize: boolean;

    private resizePollsLeft: number;

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
        this.isWatchingForResize = false;
        this.resizeHandlers = new EventHandlers();

        this.setup();
    }

    public destory(): void {
        removeEventListener("resize", this.resizeHandler);
    }

    /**
     * Resizes if the size has changed, but watches for one
     * in case it hasn't. This is for IOS Support.
     */
    public resizeOrWatch(): void {
        if (this.didResize()) {
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
        console.log("resize");
    }

    private didResize(): boolean {
        const [newWidth, newHeight] = this.sizeGetter();
        return newWidth === this.width && newHeight === this.height;
    }

    private watchForResize() {
        this.resizePollsLeft = ResizeWatcher.resizeWatchTTL;
        if (this.isWatchingForResize) { return; }
        this.resizeWatchLoop();
    }

    private resizeWatchLoop() {
        this.resizePollsLeft--;

        if (this.didResize() || this.resizePollsLeft <= 0) {
            const [newWidth, newHeight] = this.sizeGetter();
            this.isWatchingForResize = false;
            this.resize(newWidth, newHeight);
            return;
        }

        requestAnimationFrame(() => this.resizeWatchLoop());
    }
}

function defaultSizeGetter(): [number, number] {
    return [innerWidth, innerHeight];
}

export default ResizeWatcher;