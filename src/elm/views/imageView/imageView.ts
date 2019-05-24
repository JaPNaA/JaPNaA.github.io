import View from "../../../core/view/view";
import IApp from "../../../core/types/app/iApp";
import ViewMap from "../../../core/view/viewMap";
import SiteResources from "../../../core/siteResources";
import SimpleEasePhysics from "../../../components/canvasElements/physics/simpleEase";
import ImageViewCloseButton from "./closeButton";
import ImageViewImage from "./image";
import wait from "../../../utils/wait";
import triggerTransitionIn from "../../../core/utils/triggerTransitionIn";
import { Vec2 } from "../../../types/math/vec2";
import TouchControls from "../../../components/touch/touchControls";
import AppState from "../../../core/types/appState";

class ImageView extends View {
    public static viewName: string = "ImageView";
    public viewName = ImageView.viewName;
    public isFullPage: boolean = false;

    private static destorySpeed: number = 500;
    private static transitionInSpeed: number = 500;

    protected elm: HTMLDivElement;

    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;

    private image: ImageViewImage;
    private closeButton: ImageViewCloseButton;
    private closeButtonPhysics: SimpleEasePhysics;


    private src?: string;
    private fromDirectURL: boolean;

    private width: number;
    private height: number;
    private dpr: number;

    private touchControls: TouchControls;

    private then: number;
    private shouldRedraw: boolean;
    private drawing: boolean;
    private reqanfHandle: number;
    private inErrorState: boolean;

    constructor(app: IApp, state: AppState) {
        super(app);
        this.elm = document.createElement("div");
        this.canvas = document.createElement("canvas");
        this.X = this.getX();

        this.image = new ImageViewImage();

        this.closeButton = new ImageViewCloseButton(this.image);
        this.closeButtonPhysics = new SimpleEasePhysics(0.2);
        this.closeButton.attachPhysics(this.closeButtonPhysics);

        this.dpr = 1;
        this.width = 0;
        this.height = 0;

        this.touchControls = new TouchControls(this.elm);

        this.drawing = false;
        this.shouldRedraw = true;

        this.src = state.stateData;
        this.fromDirectURL = state.directURL;
        this.then = performance.now();
        this.reqanfHandle = -1;
        this.inErrorState = false;
    }

    public async setup(): Promise<void> {
        super.setup();
        this.elm.appendChild(this.canvas);

        this.redraw();
        this.addEventHandlers();
        this.resizeHandler();
        // this.resetImagePosition();
        this.touchControls.setup();

        if (this.src) {
            this.setImageSrc(this.src);
        }
    }

    public async destory(): Promise<void> {
        super.destory();
        this.removeEventHandlers();
        this.touchControls.destory();
        cancelAnimationFrame(this.reqanfHandle);
        await wait(ImageView.destorySpeed);
    }

    public setImageSrc(src: string): void {
        SiteResources.loadImage(src)
            .onLoad(e => this.setImage(e.image))
            .onError(() => this.inErrorState = true);
    }

    public setInitalTransform(x: number, y: number, scale: number): void {
        this.image.setInitalTransform(x, y, scale);
    }

    public transitionIn(): void {
        triggerTransitionIn(this.elm, ImageView.transitionInSpeed);
    }

    private setImage(image: HTMLImageElement): void {
        if (image.complete) {
            this.image.setImage(image);
            this.resetImagePosition();
        } else {
            this.inErrorState = true;
        }
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
        this.then = performance.now();
        this.reqanfLoop();
    }

    private reqanfLoop(): void {
        const now: number = performance.now();
        const deltaTime: number = now - this.then;
        this.then = now;

        this.drawing = true;
        this.tick(deltaTime);
        this.draw();

        if (this.shouldRedraw) {
            this.reqanfHandle = requestAnimationFrame(this.reqanfLoop.bind(this));
        } else {
            this.drawing = false;
        }
    }

    private tick(deltaTime: number): void {
        this.closeButton.tick(deltaTime);
        this.image.tick(deltaTime);
    }

    private draw(): void {
        this.X.scale(this.dpr, this.dpr);
        this.X.clearRect(0, 0, this.width, this.height);

        if (this.inErrorState) {
            this.drawErrorMessage();
        } else {
            this.image.draw(this.X);
        }

        this.closeButton.draw(this.X);
        this.X.resetTransform();

        this.updateShouldRedraw();
    }

    private drawErrorMessage(): void {
        const width = 256;
        const height = 64;
        const closeButtonRect = this.closeButton.getRect();
        this.X.save();
        this.X.translate(this.width / 2, this.height / 2);
        this.X.fillStyle = "#000000"
        this.X.strokeStyle = "#ff0000";
        this.X.rect(-width / 2, -height / 2, width, height);
        this.X.fill();
        this.X.lineWidth = 3;
        this.X.stroke();
        this.X.fillStyle = "#ff3030";
        this.X.font = "18px 'Roboto'";
        this.X.textAlign = "center";
        this.X.textBaseline = "middle";
        this.X.fillText("Failed to load image", 0, 2);
        this.X.restore();
        this.closeButtonPhysics.teleportTo(
            (this.width - width) / 2 - closeButtonRect.width,
            (this.height - height) / 2 - closeButtonRect.height
        );
    }

    private updateShouldRedraw(): void {
        this.shouldRedraw = (
            !this.inErrorState &&
            this.image.physics.hasRectChanged()
        ) || this.closeButton.shouldRedraw();
    }

    private addEventHandlers(): void {
        this.resizeHandler = this.resizeHandler.bind(this);
        this.events.onResize(this.resizeHandler);

        this.keyDownHandler = this.keyDownHandler.bind(this);
        addEventListener("keydown", this.keyDownHandler);

        this.closeButton.onClick(this.closeButtonClickHandler.bind(this));
        this.elm.addEventListener("wheel", this.wheelHandler.bind(this), { passive: false });
        this.elm.addEventListener("dblclick", this.doubleClickHandler.bind(this));
        this.elm.addEventListener("mousedown", this.mouseDownHandler.bind(this));
        this.elm.addEventListener("mouseup", this.mouseUpHandler.bind(this));
        this.elm.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        this.elm.addEventListener("click", this.clickHandler.bind(this));

        this.closeButton.onLoad(this.redraw.bind(this));

        this.touchControls.onTap(this.tapHandler.bind(this));
        this.touchControls.onStartMove(this.startMoveHandler.bind(this));
        this.touchControls.onMove(this.moveHandler.bind(this));
        this.touchControls.onEndMove(this.endMoveHandler.bind(this));
        this.touchControls.onZoom(this.zoomHandler.bind(this));
        this.touchControls.onDoubleTap(this.doubleTapHandler.bind(this));
    }

    private removeEventHandlers(): void {
        removeEventListener("keydown", this.keyDownHandler);
    }

    private resizeHandler(): void {
        const dpr: number = devicePixelRatio || 1;
        const actualWidth: number = this.app.width * dpr;
        const actualHeight: number = this.app.height * dpr;

        this.dpr = dpr;
        this.width = this.canvas.width = actualWidth;
        this.height = this.canvas.height = actualHeight;

        this.image.physics.resize(this.app.width, this.app.height);
        this.redraw();
    }

    private wheelHandler(e: WheelEvent): void {
        e.preventDefault();
        this.image.zoom(e.deltaY, e.layerX, e.layerY);
        this.redrawIfShould();
    }

    private zoomHandler(e: [number, Vec2]): void {
        const [factor, center] = e;
        this.image.physics.zoomInto(factor, center.x, center.y);
        this.redrawIfShould();
    }

    private doubleClickHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.alternateFitToReal(e.layerX, e.layerY);
        this.redrawIfShould();
    }

    private doubleTapHandler(vec: Vec2): void {
        this.image.alternateFitToReal(vec.x, vec.y);
        this.redrawIfShould();
    }

    private mouseMoveHandler(e: MouseEvent): void {
        this.image.physics.dragIfDragging(e.movementX, e.movementY);
        this.redrawIfShould();
    }

    private moveHandler(dv: Vec2): void {
        this.image.physics.drag(dv.x, dv.y);
        this.redrawIfShould();
    }

    private clickHandler(e: MouseEvent): void {
        e.preventDefault();
        this.closeButton.checkClick(e.layerX, e.layerY);
        this.redrawIfShould();
    }

    private tapHandler(pos: Vec2): void {
        this.closeButton.checkClick(pos.x, pos.y);
    }

    private mouseDownHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.physics.startDrag();
        this.redrawIfShould();
    }

    private startMoveHandler(): void {
        this.image.physics.startDrag();
    }

    private mouseUpHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.physics.endDrag();
        this.redrawIfShould();
    }

    private endMoveHandler(): void {
        this.image.physics.endDrag();
    }

    private closeButtonClickHandler(): void {
        if (this.fromDirectURL) {
            history.back();
        } else {
            this.app.views.close(this);
        }
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.keyCode === 48) { // 0 key
            this.resetImagePosition();
        }
    }

    private resetImagePosition(): void {
        this.image.resetImageTransform();
        this.redraw();
    }
}

ViewMap.add(ImageView);

export default ImageView;