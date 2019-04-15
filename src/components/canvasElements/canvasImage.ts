import CanvasElement from "./canvasElement";

class CanvasImage extends CanvasElement {
    private image: HTMLImageElement;

    constructor(x: number, y: number, image: HTMLImageElement) {
        if (!image.complete) { throw new Error("Image not loaded."); }
        super(x, y, image.width, image.height);
        this.image = image;
    }

    public tick(): void { }
    public draw(): void { }
    public shouldRedraw(): boolean { return true; }
}

export default CanvasImage;