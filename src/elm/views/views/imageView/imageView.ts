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

    private touchControls: TouchControls;
    // private lastMovingTouch?: Vec2;
    // private lastPinchingTouch?: Vec2;
    // private lastPinchDist?: number;

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
        this.X.clearRect(0, 0, this.width, this.height);

        this.image.draw(this.X);
        this.closeButton.draw(this.X);

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

        this.touchControls.onStartMove(() => {
            this.image.physics.startDrag();
        });
        this.touchControls.onMove(e => {
            this.image.physics.drag(e.x, e.y);
            this.redrawIfShould();
        });
        this.touchControls.onEndMove(() => {
            this.image.physics.endDrag();
        });
        this.touchControls.onZoom((e) => {
            const [factor, center] = e;
            this.image.physics.zoomInto(factor, center.x, center.y);
            this.redrawIfShould();
        });
    }

    private removeEventHandlers(): void {
        removeEventListener("keydown", this.keyDownHandler);
    }

    private resizeHandler(): void {
        this.width = this.canvas.width = this.app.width;
        this.height = this.canvas.height = this.app.height;
        this.image.physics.resize(this.width, this.height);
        this.redraw();
    }

    private wheelHandler(e: WheelEvent): void {
        e.preventDefault();
        this.image.zoom(e.deltaY, e.layerX, e.layerY);
        this.redrawIfShould();
    }

    private doubleClickHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.alternateFitToReal(e.layerX, e.layerY);
        this.redrawIfShould();
    }

    private mouseMoveHandler(e: MouseEvent): void {
        this.image.physics.dragIfDragging(e.movementX, e.movementY);
        this.redrawIfShould();
    }

    private mouseDownHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.physics.startDrag();
        // TODO: Close on actual click: not mousedown
        this.closeButton.checkClick(e.layerX, e.layerY);
        this.redrawIfShould();
    }

    private mouseUpHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.physics.endDrag();
        this.redrawIfShould();
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