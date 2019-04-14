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

    private width: number;
    private height: number;

    private x: number;
    private y: number;
    private scale: number;
    private dragging: boolean;
    private userAdjusted: boolean;

    constructor(app: IApp, stateData?: string) {
        super(app);
        this.elm = document.createElement("div");
        this.canvas = document.createElement("canvas");
        this.closeButton = SiteResources.loadImage(SiteConfig.path.img.close).image;

        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        this.X = X;

        this.elm.appendChild(this.canvas);

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.scale = 1;
        this.dragging = false;
        this.userAdjusted = false;

        // this.background = this.createBackground();
        if (stateData) {
            this.setImageSrc(stateData);
        }
        this.reqanfLoop();
        this.addEventHandlers();
        this.resizeHandler();
        this.resetImagePosition();
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
    }

    private reqanfLoop(): void {
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
        this.x += (this.app.width - this.width) / 2;
        this.y += (this.app.height - this.height) / 2;

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

        this.scale *= factor;

        this.x -= (e.clientX - this.x) * (factor - 1);
        this.y -= (e.clientY - this.y) * (factor - 1);
        this.userAdjusted = true;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (!this.dragging) { return; }
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
            this.scale = 1;
        } else {
            this.scale = Math.min(
                this.width / this.image.width,
                this.height / this.image.height
            );
        }

        this.x = (this.width - this.image.width * this.scale) / 2;
        this.y = (this.height - this.image.height * this.scale) / 2;

        this.userAdjusted = false;
    }
}

ViewMap.add(ImageView);

export default ImageView;