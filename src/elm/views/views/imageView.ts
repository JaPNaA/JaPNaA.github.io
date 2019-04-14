import View from "../view";
import IApp from "../../../types/app/iApp";
import ViewMap from "../viewMap";
import SiteResources from "../../../siteResources";
import removeChildren from "../../../utils/removeChildren";
import SiteConfig from "../../../siteConfig";

class ImageView extends View {
    public static viewName: string = "ImageView";
    public viewName = ImageView.viewName;
    public isFullPage: boolean = false;

    protected elm: HTMLDivElement;

    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;
    private image?: HTMLImageElement;
    private closeButton: HTMLImageElement;

    private src?: string;

    private width: number;
    private height: number;

    private x: number;
    private lastX: number;
    private targetX: number;
    private velocityX: number;
    private y: number;
    private lastY: number;
    private targetY: number;
    private velocityY: number;
    private scale: number;
    private tscale: number;
    private dragging: boolean;
    private userAdjusted: boolean;

    constructor(app: IApp, stateData?: string) {
        super(app);
        this.elm = document.createElement("div");
        this.canvas = document.createElement("canvas");
        this.closeButton = SiteResources.loadImage(SiteConfig.path.img.close).image;
        this.X = this.getX();

        this.width = 0;
        this.height = 0;

        this.lastX = this.targetX = this.x = 0;
        this.lastY = this.targetY = this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.tscale = this.scale = 1;

        this.dragging = false;
        this.userAdjusted = false;

        this.src = stateData;
    }

    public async setup(): Promise<void> {
        super.setup();
        this.elm.appendChild(this.canvas);

        this.reqanfLoop();
        this.addEventHandlers();
        this.resizeHandler();
        this.resetImagePosition();

        if (this.src) {
            this.setImageSrc(this.src);
        }
    }

    public setImageSrc(src: string) {
        SiteResources.loadImage(src)
            .onLoad(e =>
                this.setImage(e.copyImage())
            );
    }


    private setImage(image: HTMLImageElement) {
        this.image = image;
        this.resetImagePosition();
        this.stopAnimations();
    }

    private getX(): CanvasRenderingContext2D {
        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        return X;
    }

    private reqanfLoop(): void {
        this.x += (this.targetX - this.x) / 10;
        this.y += (this.targetY - this.y) / 10;
        this.scale += (this.tscale - this.scale) / 10;
        if (this.dragging) {
            this.velocityX = (this.x - this.lastX) * 0.7 + this.velocityX * 0.3;
            this.velocityY = (this.y - this.lastY) * 0.7 + this.velocityY * 0.3;
            this.lastX = this.x;
            this.lastY = this.y;
        } else {
            this.velocityX *= 0.93;
            this.velocityY *= 0.93;
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.targetX += this.velocityX;
            this.targetY += this.velocityY;
        }

        this.draw();
        requestAnimationFrame(this.reqanfLoop.bind(this));
    }

    private draw() {
        if (!this.image) { return; }
        this.X.clearRect(0, 0, this.width, this.height);
        this.X.drawImage(
            this.image,
            0, 0, this.image.width, this.image.height,
            this.x, this.y, this.image.width * this.scale, this.image.height * this.scale
        );
        // this.X.drawImage(
        //     this.image,
        //     0, 0, this.image.width, this.image.height,
        //     this.tx, this.ty, this.image.width * this.tscale, this.image.height * this.tscale
        // );
        this.X.drawImage(this.closeButton, 0, 0);
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.events.onResize(this.resizeHandler);

        this.wheelHandler = this.wheelHandler.bind(this);
        this.elm.addEventListener("wheel", this.wheelHandler);

        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.elm.addEventListener("mousedown", this.mouseDownHandler);

        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.elm.addEventListener("mouseup", this.mouseUpHandler);

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.elm.addEventListener("mousemove", this.mouseMoveHandler);

        this.keyDownHandler = this.keyDownHandler.bind(this);
        addEventListener("keydown", this.keyDownHandler);
    }

    private resizeHandler(): void {
        const dx = (this.app.width - this.width) / 2;
        const dy = (this.app.height - this.height) / 2;
        this.x += dx;
        this.y += dy;
        this.targetX += dx;
        this.targetY += dy;

        this.width = this.canvas.width = this.app.width;
        this.height = this.canvas.height = this.app.height;

        if (!this.userAdjusted) {
            this.resetImagePosition();
        }
    }

    private wheelHandler(e: WheelEvent): void {
        e.preventDefault();

        let factor = 1.1;
        if (e.deltaY > 0) {
            factor = 1 / factor;
        }

        this.tscale *= factor;

        this.targetX -= (e.clientX - this.targetX) * (factor - 1);
        this.targetY -= (e.clientY - this.targetY) * (factor - 1);
        this.userAdjusted = true;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (!this.dragging) { return; }
        this.targetX += e.movementX;
        this.targetY += e.movementY;
        this.x += e.movementX;
        this.y += e.movementY;
        this.userAdjusted = true;
    }

    private mouseDownHandler(): void {
        this.dragging = true;
    }

    private mouseUpHandler(): void {
        this.dragging = false;
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.keyCode === 48) {
            this.resetImagePosition();
        }
    }

    private resetImagePosition(): void {
        if (!this.image) { return; }
        if (this.image.width <= this.width && this.image.height <= this.height) {
            this.tscale = 1;
        } else {
            this.tscale = Math.min(
                this.width / this.image.width,
                this.height / this.image.height
            );
        }

        this.targetX = (this.width - this.image.width * this.tscale) / 2;
        this.targetY = (this.height - this.image.height * this.tscale) / 2;

        this.userAdjusted = false;
    }

    private stopAnimations(): void {
        this.x = this.targetX;
        this.y = this.targetY;
        this.scale = this.tscale;
    }
}

ViewMap.add(ImageView);

export default ImageView;