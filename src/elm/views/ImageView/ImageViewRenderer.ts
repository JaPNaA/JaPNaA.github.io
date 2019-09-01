import LazyCanvasRenderer from "../../../components/canvas/renderer/lazyCanvasRenderer";
import ImageView from "./ImageView";
import IApp from "../../../core/types/app/IApp";

class ImageViewRenderer extends LazyCanvasRenderer {
    private imageView: ImageView;

    constructor(app: IApp, imageView: ImageView) {
        super(app, app.width, app.height, false);
        this.imageView = imageView;
        this.onResize(() => this.updateSize());
    }

    protected hasChanged(): boolean {
        return this.imageView.shouldRedraw();
    }

    protected tick(deltaTime: number): void {
        this.imageView.tick(deltaTime);
    }

    protected draw(X: CanvasRenderingContext2D): void {
        X.clearRect(0, 0, this.width, this.height);
        this.imageView.draw(X);
    }

    protected getNewSize(): [number, number] {
        return [this.app.width, this.app.height];
    }

    protected isVisible(): boolean {
        return true;
    }
}

export default ImageViewRenderer;