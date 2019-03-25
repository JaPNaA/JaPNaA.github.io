import Resource from "./resource";
import ResourceLoaderHooks from "../resourceLoaderHooks";

class TextResource extends Resource {
    public path: string;
    public text?: string;

    constructor(hooks: ResourceLoaderHooks, path: string) {
        super(hooks);
        this.path = path;

        this.getText(path);
    }

    private getText(path: string): void {
        const req = new XMLHttpRequest();
        req.open("GET", path);
        req.responseType = "text";

        req.addEventListener("load", () => {
            this.text = req.responseText;

            if (req.status >= 400) {
                this.onErrorHandler(new Error(
                    "Failed to load " + this.path + ": " +
                    req.status + " (" + req.statusText + ")"
                ));
            } else {
                this.onLoadHandler();
            }
        });

        req.addEventListener("error", (err) => {
            this.onErrorHandler(new Error("Failed to load " + this.path + ", not connected to internet?"));
        });

        req.send();
    }
}

export default TextResource;