import Resource from "./resource";
import ResourceLoaderHooks from "../resourceLoaderHooks";

class ImageResource extends Resource {
    public image: HTMLImageElement;
    public path: string;

    constructor(hooks: ResourceLoaderHooks, path: string) {
        super(hooks);

        this.image = document.createElement("img");
        this.path = path;
        this.image.src = path;

        this.image.addEventListener("load", () => this.onLoadHandler());
        this.image.addEventListener("error", e => this.onErrorHandler(e.error));
    }

    public _isStillLoaded(): boolean {
        return this.image.complete;
    }

    public copyImage(): HTMLImageElement {
        return this.image.cloneNode() as HTMLImageElement;
    }
}

export default ImageResource;