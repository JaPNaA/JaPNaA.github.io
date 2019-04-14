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

        // this.background = this.createBackground();
        if (stateData) {
            this.setImageSrc(stateData);
        }
        this.reqanfLoop();
        this.addEventHandlers();
        this.resizeHandler();
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
    }

    private resizeHandler(): void {
        this.width = this.canvas.width = this.app.width;
        this.height = this.canvas.height = this.app.height;
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
    }

    private mouseDownHandler(): void {
        this.dragging = true;
    }

    private mouseUpHandler(): void {
        this.dragging = false;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (!this.dragging) { return; }
        this.x += e.movementX;
        this.y += e.movementY;
    }

    public reqanfLoop(): void {
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

    public setImageSrc(src: string) {
        SiteResources.loadImage(src)
            .onLoad(e =>
                this.setImage(e.copyImage())
            );
    }

    private setImage(image: HTMLImageElement) {
        this.image = image;
    }
}

ViewMap.add(ImageView);

export default ImageView;