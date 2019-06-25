import Resource from "./Resource";
import ResourceLoaderHooks from "../ResourceLoaderHooks";

class ImageResource extends Resource<HTMLImageElement> {
    public data: HTMLImageElement;
    public path: string;

    constructor(hooks: ResourceLoaderHooks, path: string) {
        super(hooks);

        this.data = document.createElement("img");
        this.path = path;
        this.data.src = path;

        this.data.addEventListener("load", () => this.onLoadHandler());
        this.data.addEventListener("error", e =>
            this.onErrorHandler(
                e.error ||
                new Error("Failed to load image")
            )
        );
    }

    public _isStillLoaded(): boolean {
        return this.data.complete;
    }

    public copyImage(): HTMLImageElement {
        return this.data.cloneNode() as HTMLImageElement;
    }
}

export default ImageResource;