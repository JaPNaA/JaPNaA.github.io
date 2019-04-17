import View from "../../view";
import IApp from "../../../../types/app/iApp";
import ViewMap from "../../viewMap";
import SiteResources from "../../../../siteResources";
import SimpleEasePhysics from "../../../../components/canvasElements/physics/simpleEase";
import CloseButton from "./closeButton";
import DragPhysics from "../../../../components/canvasElements/physics/drag";
import CanvasImage from "../../../../components/canvasElements/canvasImage";
import { Dim, newDim } from "../../../../types/math/dim";

class ImageView extends View {
    public static viewName: string = "ImageView";
    public viewName = ImageView.viewName;
    public isFullPage: boolean = false;

    private static zoomFactor: number = 1.1;

    protected elm: HTMLDivElement;

    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;
    private closeButton: CloseButton;
    private closeButtonPhysics: SimpleEasePhysics;

    private image?: HTMLImageElement;

    private then: number;

    private src?: string;
    private hasInitalTransform: boolean;

    private width: number;
    private height: number;

    private canvasImage?: CanvasImage;
    private imagePhysics: DragPhysics;


    private shouldRedraw: boolean;
    private drawing: boolean;
    private userAdjusted: boolean;

    constructor(app: IApp, stateData?: string) {
        super(app);
        this.elm = document.createElement("div");
        this.canvas = document.createElement("canvas");
        this.X = this.getX();

        this.closeButton = new CloseButton();
        this.closeButtonPhysics = new SimpleEasePhysics(0.05);
        this.closeButton.setPhysics(this.closeButtonPhysics);

        this.hasInitalTransform = false;

        this.width = 0;
        this.height = 0;

        this.imagePhysics = new DragPhysics({
            transitionSpeed: 0.1,
            initFlickSmoothing: 0.5,
            flickFriction: 0.9
        });

        this.userAdjusted = false;
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
        this.imagePhysics.teleportTo(x, y);
        this.imagePhysics.setScale(scale);
        this.hasInitalTransform = true;
    }

    private setImage(image: HTMLImageElement) {
        this.image = image;

        this.canvasImage = new CanvasImage(0, 0, this.image);
        this.canvasImage.setPhysics(this.imagePhysics);

        this.resetImagePosition();

        if (!this.hasInitalTransform) {
            this.stopAnimations();
        }

    }

    private getX(): CanvasRenderingContext2D {
        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        return X;
    }

    private redraw(): void {
        if (this.drawing) { return; }
        this.shouldRedraw = true;
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

        if (this.canvasImage) {
            this.canvasImage.tick(deltaTime);
        }
    }

    private draw() {
        if (!this.image) { return; }
        this.X.clearRect(0, 0, this.width, this.height);


        this.X.imageSmoothingEnabled = this.imagePhysics.getScale() < 3;
        // at some point, when it's zoomed in enough, open the skyrim intro, if the meme is still relevant
        // <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/RrjJtYpOawU?start=61&autoplay=1&mute=1&controls=0&disablekb=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        this.X.save();

        this.X.shadowColor = "rgba(0,0,0,0.35)";
        this.X.shadowBlur = 8;
        this.X.shadowOffsetX = 0;
        this.X.shadowOffsetY = 4;

        if (this.canvasImage) {
            this.canvasImage.draw(this.X);

            const rect = this.canvasImage.getRect();

            if (rect.x < 0) {
                this.closeButtonPhysics.moveTo(0, 0);
            } else {
                this.closeButtonPhysics.teleportTo(rect.x - CloseButton.width, rect.y - CloseButton.height);
            }
            this.closeButton.draw(this.X);
        }
        // this.X.drawImage(
        //     this.image,
        //     0, 0, this.image.width, this.image.height,
        //     this.x, this.y, this.image.width * this.scale, this.image.height * this.scale
        // );
        this.X.restore();

        // this.X.drawImage(this.closeButtonImage, 0, 0);

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
        this.imagePhysics.resize(this.width, this.height);

        if (!this.userAdjusted) {
            this.resetImagePosition();
            this.stopAnimations();
        }
        this.redraw();
    }

    private wheelHandler(e: WheelEvent): void {
        e.preventDefault();
        if (e.deltaY > 0) {
            this.imagePhysics.zoomOutFrom(ImageView.zoomFactor, e.clientX, e.clientY);
        } else {
            this.imagePhysics.zoomInto(ImageView.zoomFactor, e.clientX, e.clientY);
        }

        this.userAdjusted = true;
        this.redraw();
    }

    private mouseMoveHandler(e: MouseEvent): void {
        this.imagePhysics.mouseMove(e.movementX, e.movementY);

        this.userAdjusted = true;
        this.redraw();
    }

    private mouseDownHandler(e: MouseEvent): void {
        this.imagePhysics.mouseDown();
        // TODO: Close on actual click: not mousedown
        this.closeButton.checkClick(e.clientX, e.clientY);
    }

    private mouseUpHandler(): void {
        this.imagePhysics.mouseUp();
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
        if (!this.canvasImage) { return; }
        this.imagePhysics.resetImageTransform();
        this.userAdjusted = false;
        this.redraw();
    }

    private stopAnimations(): void {
        // this.imagePhysics.stopAnimations();
        this.redraw();
    }
}

ViewMap.add(ImageView);

export default ImageView;