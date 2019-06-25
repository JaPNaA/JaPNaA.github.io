import "../../../../styles/views/ImageView.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import ViewMap from "../../../core/view/ViewMap";
import siteResources from "../../../core/siteResources";
import SimpleEasePhysics from "../../../components/canvas/canvasElements/physics/simpleEase";
import ImageViewCloseButton from "./ImageViewCloseButton";
import ImageViewImage from "./ImageViewImage";
import wait from "../../../utils/wait";
import triggerTransitionIn from "../../../core/utils/triggerTransitionIn";
import { Vec2 } from "../../../types/math/Vec2";
import TouchControls from "../../../components/touch/touchControls";
import AppState from "../../../core/types/AppState";
import ImageViewRenderer from "./ImageViewRenderer";
import WidgetMap from "../../../core/widget/WidgetMap";
import IIFrame from "../../widgets/IFrame/IIFrame";

class ImageView extends View {
    public static viewName: string = "ImageView";
    public viewName = ImageView.viewName;
    public isFullPage: boolean = false;

    private static destorySpeed: number = 500;
    private static transitionInSpeed: number = 500;

    protected elm: HTMLDivElement;

    private renderer: ImageViewRenderer;
    private touchControls: TouchControls;

    private image: ImageViewImage;
    private closeButton: ImageViewCloseButton;
    private closeButtonPhysics: SimpleEasePhysics;

    private src?: string;
    private fromDirectURL: boolean;
    private inErrorState: boolean;

    constructor(app: IApp, state: AppState) {
        super(app);
        this.elm = document.createElement("div");
        this.renderer = new ImageViewRenderer(app, this);

        this.image = new ImageViewImage();

        this.closeButton = new ImageViewCloseButton(this.image);
        this.closeButtonPhysics = new SimpleEasePhysics(0.2);
        this.closeButton.attachPhysics(this.closeButtonPhysics);

        this.touchControls = new TouchControls(this.elm);

        this.src = state.stateData;
        this.fromDirectURL = state.directURL !== undefined;
        this.inErrorState = false;
    }

    public async setup(): Promise<void> {
        super.setup();
        this.renderer.appendTo(this.elm);

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
        this.touchControls.destory();
        this.renderer.destory();
        await wait(ImageView.destorySpeed);
    }

    public setImageSrc(src: string): void {
        siteResources.loadImage(src)
            .onLoad(e => this.setImage(e.data))
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

    public tick(deltaTime: number): void {
        this.closeButton.tick(deltaTime);
        this.image.tick(deltaTime);
    }

    public draw(X: CanvasRenderingContext2D): void {
        if (this.inErrorState) {
            this.drawErrorMessage(X);
        } else {
            this.image.draw(X);
        }

        this.closeButton.draw(X);
        this.renderer.resetTransform();
    }

    private drawErrorMessage(X: CanvasRenderingContext2D): void {
        const width = 256;
        const height = 64;
        const closeButtonRect = this.closeButton.getRect();
        X.save();
        X.translate(this.renderer.width / 2, this.renderer.height / 2);
        X.fillStyle = "#000000"
        X.strokeStyle = "#ff0000";
        X.rect(-width / 2, -height / 2, width, height);
        X.fill();
        X.lineWidth = 3;
        X.stroke();
        X.fillStyle = "#ff3030";
        X.font = "18px 'Roboto', sans-serif";
        X.textAlign = "center";
        X.textBaseline = "middle";
        X.fillText("Failed to load image", 0, 2);
        X.restore();
        this.closeButtonPhysics.teleportTo(
            (this.renderer.width - width) / 2 - closeButtonRect.width,
            (this.renderer.height - height) / 2 - closeButtonRect.height
        );
    }

    public shouldRedraw(): boolean {
        return (
            !this.inErrorState &&
            this.image.physics.hasRectChanged()
        ) || this.closeButton.shouldRedraw();
    }

    private addEventHandlers(): void {
        this.renderer.onResize(this.resizeHandler.bind(this));
        this.events.onKeydown(this.keyDownHandler.bind(this));

        this.closeButton.onClick(this.closeButtonClickHandler.bind(this));
        this.elm.addEventListener("wheel", this.wheelHandler.bind(this), { passive: false });
        this.elm.addEventListener("dblclick", this.doubleClickHandler.bind(this));
        this.elm.addEventListener("mousedown", this.mouseDownHandler.bind(this));
        this.elm.addEventListener("mouseup", this.mouseUpHandler.bind(this));
        this.elm.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        this.elm.addEventListener("click", this.clickHandler.bind(this));

        this.closeButton.onLoad(() => this.renderer.requestDraw());

        this.touchControls.onTap(this.tapHandler.bind(this));
        this.touchControls.onStartMove(this.startMoveHandler.bind(this));
        this.touchControls.onMove(this.moveHandler.bind(this));
        this.touchControls.onEndMove(this.endMoveHandler.bind(this));
        this.touchControls.onZoom(this.zoomHandler.bind(this));
        this.touchControls.onDoubleTap(this.doubleTapHandler.bind(this));

        this.image.onSkyrim(this.skyrimHandler.bind(this));
    }

    private resizeHandler(): void {
        this.image.physics.resize(this.app.width, this.app.height);
    }

    private wheelHandler(e: WheelEvent): void {
        e.preventDefault();
        this.image.zoom(e.deltaY, e.layerX, e.layerY);
        this.renderer.drawIfShould();
    }

    private zoomHandler(e: [number, Vec2]): void {
        const [factor, center] = e;
        this.image.physics.zoomInto(factor, center.x, center.y);
        this.renderer.drawIfShould();
    }

    private doubleClickHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.alternateFitToReal(e.layerX, e.layerY);
        this.renderer.drawIfShould();
    }

    private doubleTapHandler(vec: Vec2): void {
        this.image.alternateFitToReal(vec.x, vec.y);
        this.renderer.drawIfShould();
    }

    private mouseMoveHandler(e: MouseEvent): void {
        this.image.physics.dragIfDragging(e.movementX, e.movementY);
        this.renderer.drawIfShould();
    }

    private moveHandler(dv: Vec2): void {
        this.image.physics.drag(dv.x, dv.y);
        this.renderer.drawIfShould();
    }

    private clickHandler(e: MouseEvent): void {
        e.preventDefault();
        this.closeButton.checkClick(e.layerX, e.layerY);
        this.renderer.drawIfShould();
    }

    private tapHandler(pos: Vec2): void {
        this.closeButton.checkClick(pos.x, pos.y);
    }

    private mouseDownHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.physics.startDrag();
        this.renderer.drawIfShould();
    }

    private startMoveHandler(): void {
        this.image.physics.startDrag();
    }

    private mouseUpHandler(e: MouseEvent): void {
        e.preventDefault();
        this.image.physics.endDrag();
        this.renderer.drawIfShould();
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
        this.renderer.requestDraw();
    }

    private async skyrimHandler(): Promise<void> {
        const iframe = new (await WidgetMap.get("IFrame"))(
            "https://www.youtube-nocookie.com/embed/RrjJtYpOawU?start=61&autoplay=1&mute=1&controls=0&disablekb=1"
        ) as IIFrame;
        iframe.setup();
        iframe.appendTo(this.elm);
    }
}

ViewMap.add(ImageView);

export default ImageView;