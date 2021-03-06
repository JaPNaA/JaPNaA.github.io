import EventHandlers from "../../../core/utils/events/EventHandlers";
import Handler from "../../../core/utils/events/Handler";
import IApp from "../../../core/types/app/IApp";
import isVisible from "../../../utils/isVisible";

type Vec2 = [number, number];

/**
 * A class calls it's `draw` and `tick` only when nessassary
 */
abstract class LazyCanvasRenderer {
    public width: number;
    public height: number;
    public dpr: number;

    protected canvas: HTMLCanvasElement;
    protected app: IApp;
    private X: CanvasRenderingContext2D;

    private then: number;
    private reqnafHandle: number;

    private forceNextRedraw: boolean;
    private isDrawing: boolean;
    private resizeHandlers: EventHandlers;

    constructor(app: IApp, width: number, height: number, opaque?: boolean);
    constructor(app: IApp);
    constructor(app: IApp, width?: number, height?: number, opaque?: boolean) {
        this.canvas = document.createElement("canvas");
        this.app = app;

        const X = this.canvas.getContext("2d", { alpha: !opaque });
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
        this.reqnafHandle = -1;

        this.forceNextRedraw = false;
        this.isDrawing = false;
        this.resizeHandlers = new EventHandlers();

        this.setup();
    }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.canvas);
    }

    public destory(): void {
        cancelAnimationFrame(this.reqnafHandle);
        this.app.events.offResize(this.resizeHandler);
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

    public updateSize(): void {
        const [width, height] = this.getNewSize();
        this.width = width;
        this.height = height;
        this.updateCanvasSize();
        this.requestDraw();
    }

    /**
     * Updates last tick time to current time, effectively clearing the timer
     */
    public clearTimer(): void {
        this.then = performance.now();
    }

    public getContext(): CanvasRenderingContext2D {
        return this.X;
    }

    /**
     * Add resize handler, guarantees firing before drawing
     */
    public onResize(handler: Handler) {
        this.resizeHandlers.add(handler);
    }

    public offResize(handler: Handler) {
        this.resizeHandlers.remove(handler);
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
        return isVisible(this.canvas);
    }

    private setup(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.app.events.onResize(this.resizeHandler);
    }

    private resizeHandler(): void {
        this.resizeHandlers.dispatch();
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

    private updateCanvasSize(): void {
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";

        if (this.dpr !== 1) {
            this.resetTransform();
        }
    }
}

export default LazyCanvasRenderer;