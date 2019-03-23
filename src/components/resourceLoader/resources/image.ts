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

    public copyImage(): HTMLImageElement {
        const img = document.createElement("img");
        img.src = this.path;
        return img;
    }
}

export default ImageResource;