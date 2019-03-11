import Resource from "./resource";
import ResourceLoaderHooks from "../resourceLoaderHooks";

class ImageResource extends Resource {
    public image: HTMLImageElement;

    constructor(hooks: ResourceLoaderHooks, path: string) {
        super(hooks);

        this.image = document.createElement("img");
        this.image.src = path;

        this.image.addEventListener("load", () => this.onLoadHandler());
        this.image.addEventListener("error", e => this.onErrorHandler(e.error));
    }
}

export default ImageResource;