import View from "../../view";
import IApp from "../../../../types/app/iApp";
import ViewMap from "../../viewMap";
import SiteResources from "../../../../siteResources";
import SimpleEasePhysics from "../../../../components/canvasElements/physics/simpleEase";
import ImageViewCloseButton from "./closeButton";
import ImageViewImage from "./image";
import wait from "../../../../utils/wait";
import triggerTransitionIn from "../../../../utils/triggerTransitionIn";
import { newVec2, Vec2 } from "../../../../types/math/vec2";
import getDist from "../../../../utils/math/getDist";
import TouchControls from "../../../../components/touch/touchControls";

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

    private width: number;
    private height: number;
    private dpr: number;

    private touchControls: TouchControls;

    private then: number;
    private shouldRedraw: boolean;
    private drawing: boolean;
    private reqanfHandle: number;

    constructor(app: IApp, stateData?: string) {
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

        this.src = stateData;
        this.then = performance.now();
        this.reqanfHandle = -1;
    }

    public async setup(): Promise<void> {
        super.setup();
        this.elm.appendChild(this.canvas);

        this.redraw();
        this.addEventHandlers();
        this.resizeHandler();
        this.resetImagePosition();
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
            .onLoad(e =>
                this.setImage(e.copyImage())
            );
    }

    public setInitalTransform(x: number, y: number, scale: number): void {
        this.image.setInitalTransform(x, y, scale);
    }

    public transitionIn(): void {
        triggerTransitionIn(this.elm, ImageView.transitionInSpeed);
    }

    private setImage(image: HTMLImageElement): void {
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
        this.then = performance.now();
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

        this.image.draw(this.X);
        this.closeButton.draw(this.X);
        this.X.resetTransform();

        this.updateShouldRedraw();
    }

    private updateShouldRedraw(): void {
        this.shouldRedraw = this.image.physics.hasRectChanged() || this.closeButton.shouldRedraw();
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
        const dpr = devicePixelRatio || 1;
        const actualWidth = this.app.width * dpr;
        const actualHeight = this.app.height * dpr;

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
        console.log("doubletap");
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