import View from "../../view";
import IApp from "../../../../types/app/iApp";
import ViewMap from "../../viewMap";
import SiteResources from "../../../../siteResources";
import SimpleEasePhysics from "../../../../components/canvasElements/physics/simpleEase";
import ImageViewCloseButton from "./closeButton";
import ImageViewImage from "./image";

class ImageView extends View {
    public static viewName: string = "ImageView";
    public viewName = ImageView.viewName;
    public isFullPage: boolean = false;

    protected elm: HTMLDivElement;

    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;

    private image: ImageViewImage;
    private closeButton: ImageViewCloseButton;
    private closeButtonPhysics: SimpleEasePhysics;


    private src?: string;

    private width: number;
    private height: number;

    private then: number;
    private shouldRedraw: boolean;
    private drawing: boolean;

    constructor(app: IApp, stateData?: string) {
        super(app);
        this.elm = document.createElement("div");
        this.canvas = document.createElement("canvas");
        this.X = this.getX();

        this.image = new ImageViewImage();

        this.closeButton = new ImageViewCloseButton(this.image);
        this.closeButtonPhysics = new SimpleEasePhysics(0.2);
        this.closeButton.attachPhysics(this.closeButtonPhysics);

        this.width = 0;
        this.height = 0;

        this.drawing = false;
        this.shouldRedraw = true;

        this.src = stateData;
        this.then = performance.now();
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

    public setInitalTransform(x: number, y: number, scale: number): void {
        this.image.setInitalTransform(x, y, scale);
    }

    private setImage(image: HTMLImageElement) {
        this.image.setImage(image);
        this.resetImagePosition();
    }

    private getX(): CanvasRenderingContext2D {
        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        return X;
    }

    private redrawIfShould(): void {
        this.updateShouldRedraw();
        if (this.shouldRedraw) {
            this.redraw();
        }
    }

    private redraw(): void {
        if (this.drawing) { return; }
        this.reqanfLoop();
    }

    private reqanfLoop(): void {
        const now = performance.now();
        const deltaTime = now - this.then;
        this.then = now;

        this.drawing = true;
        this.tick(deltaTime);
        this.draw();

        if (this.shouldRedraw) {
            requestAnimationFrame(this.reqanfLoop.bind(this));
        } else {
            this.drawing = false;
        }
    }

    private tick(deltaTime: number): void {
        this.closeButton.tick(deltaTime);
        this.image.tick(deltaTime);
    }

    private draw() {
        this.X.clearRect(0, 0, this.width, this.height);

        this.image.draw(this.X);
        this.closeButton.draw(this.X);

        this.X.restore();
        this.updateShouldRedraw();
    }

    private updateShouldRedraw(): void {
        this.shouldRedraw = this.image.physics.hasRectChanged() || this.closeButtonPhysics.hasRectChanged();
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

        this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);
        this.closeButton.onClick(this.closeButtonClickHandler);
    }

    private resizeHandler(): void {
        this.width = this.canvas.width = this.app.width;
        this.height = this.canvas.height = this.app.height;
        this.image.physics.resize(this.width, this.height);
        this.redraw();
    }

    private wheelHandler(e: WheelEvent): void {
        e.preventDefault();
        this.image.zoom(e.deltaY, e.clientX, e.clientY);
        this.redrawIfShould();
    }

    private mouseMoveHandler(e: MouseEvent): void {
        this.image.physics.mouseMove(e.movementX, e.movementY);
        this.redrawIfShould();
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.image.physics.mouseDown();
        // TODO: Close on actual click: not mousedown
        this.closeButton.checkClick(e.clientX, e.clientY);
    }

    private mouseUpHandler(): void {
        this.image.physics.mouseUp();
    }

    private closeButtonClickHandler(): void {
        this.app.views.close(this);
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.keyCode === 48) { // 0 key
            this.resetImagePosition();
        }
    }

    private resetImagePosition(): void {
        this.image.physics.resetImageTransform();
        this.redraw();
    }
}

ViewMap.add(ImageView);

export default ImageView;