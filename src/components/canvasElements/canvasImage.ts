import CanvasElement from "./canvasElement";

class CanvasImage extends CanvasElement {
    private image: HTMLImageElement;

    constructor(x: number, y: number, image: HTMLImageElement) {
        if (!image.complete) { throw new Error("Image not loaded."); }
        super(x, y, image.width, image.height);
        this.image = image;
    }

    public tick(): void { }
    public draw(X: CanvasRenderingContext2D): void {
        X.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
    public shouldRedraw(): boolean { return true; }
}

export default CanvasImage;