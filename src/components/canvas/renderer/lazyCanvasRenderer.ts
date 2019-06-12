import EventHandlers from "../../../core/utils/events/eventHandlers";
import Handler from "../../../core/utils/events/handler";

type Vec2 = [number, number];

abstract class LazyCanvasRenderer {
    public width: number;
    public height: number;
    public dpr: number;

    protected canvas: HTMLCanvasElement;

    private static resizeWatchTTL: number = 120;
    private X: CanvasRenderingContext2D;

    private then: number;
    private resizePollsLeft: number;
    private reqnafHandle: number;

    private forceNextRedraw: boolean;
    private isDrawing: boolean;
    private isWatchingForResize: boolean;


    private resizeHandlers: EventHandlers<Vec2>;

    constructor(width: number, height: number);
    constructor();
    constructor(width?: number, height?: number) {
        this.canvas = document.createElement("canvas");

        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        this.X = X;

        if (width && height) {
            this.width = width;
            this.height = height;
        } else {
            const [newWidth, newHeight] = this.getNewSize();
            this.width = newWidth;
            this.height = newHeight
        }

        this.dpr = window.devicePixelRatio || 1;
        this.updateCanvasSize();

        this.then = performance.now();
        this.resizePollsLeft = 0;
        this.reqnafHandle = -1;

        this.forceNextRedraw = false;
        this.isDrawing = false;
        this.isWatchingForResize = false;

        this.resizeHandlers = new EventHandlers();
    }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.canvas);
    }

    public destory(): void {
        cancelAnimationFrame(this.reqnafHandle);
    }

    /**
     * Requests a draw, doesn't check if it should
     */
    public requestDraw(): void {
        if (this.isDrawing) {
            this.forceNextRedraw = true;
        } else {
            this.reqanfHandler(performance.now());
        }
    }

    public drawIfShould(): void {
        if (this.checkShouldRedraw()) {
            this.requestDraw();
        }
    }

    /**
     * Updates last tick time to current time, effectively clearing the timer
     */
    public clearTimer(): void {
        this.then = performance.now();
    }

    /**
     * Resizes if the size has changed, but watches for one
     * in case it hasn't. This is for IOS Support.
     */
    public resizeOrWatchForResize(): void {
        if (this.didResize()) {
            this.watchForResize();
        } else {
            const [newWidth, newHeight] = this.getNewSize();
            this.resize(newWidth, newHeight);
        }
    }

    public onResize(handler: Handler<Vec2>): void {
        this.resizeHandlers.add(handler);
    }

    public offResize(handler: Handler<Vec2>): void {
        this.resizeHandlers.remove(handler);
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.updateCanvasSize();
        this.resizeHandlers.dispatch([width, height]);
        this.requestDraw();
    }

    public getContext(): CanvasRenderingContext2D {
        return this.X;
    }

    public resetTransform() {
        this.X.resetTransform();
        this.X.scale(this.dpr, this.dpr);
    }


    protected abstract hasChanged(): boolean;
    protected abstract tick(deltaTime: number): void;
    protected abstract draw(X: CanvasRenderingContext2D): void;
    protected abstract getNewSize(): Vec2;

    protected isVisible(): boolean {
        const bbox = this.canvas.getBoundingClientRect();
        return bbox.top + bbox.height > 0;
    }

    private didResize(): boolean {
        const [newWidth, newHeight] = this.getNewSize();
        return newWidth === this.width && newHeight === this.height;
    }

    private reqanfHandler(now: number): void {
        const deltaTime = now - this.then;
        this.then = now;
        this.isDrawing = true;

        this.tick(deltaTime);
        this.draw(this.X);

        const shouldRedraw = this.checkShouldRedraw();
        if (shouldRedraw) {
            this.reqnafHandle = requestAnimationFrame((e) => this.reqanfHandler(e));
        }
        this.isDrawing = shouldRedraw;
    }

    private checkShouldRedraw(): boolean {
        if (this.forceNextRedraw) {
            this.forceNextRedraw = false;
            return true;
        } else {
            return this.isVisible() && this.hasChanged();
        }
    }

    private watchForResize() {
        this.resizePollsLeft = LazyCanvasRenderer.resizeWatchTTL;
        if (this.isWatchingForResize) { return; }
        this.resizeWatchLoop();
    }

    private resizeWatchLoop() {
        this.resizePollsLeft--;

        if (this.didResize() || this.resizePollsLeft <= 0) {
            const [newWidth, newHeight] = this.getNewSize();
            this.isWatchingForResize = false;
            this.resize(newWidth, newHeight);
            return;
        }

        requestAnimationFrame(() => this.resizeWatchLoop());
    }

    private updateCanvasSize(): void {
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";

        if (this.dpr !== 1) {
            this.X.scale(this.dpr, this.dpr);
        }
    }
}

export default LazyCanvasRenderer;