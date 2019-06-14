type Vec2 = [number, number];

abstract class LazyCanvasRenderer {
    public width: number;
    public height: number;
    public dpr: number;

    protected canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;

    private then: number;
    private reqnafHandle: number;

    private forceNextRedraw: boolean;
    private isDrawing: boolean;

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
        this.reqnafHandle = -1;

        this.forceNextRedraw = false;
        this.isDrawing = false;
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