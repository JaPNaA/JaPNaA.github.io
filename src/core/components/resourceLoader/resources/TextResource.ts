import Resource from "./Resource";
import ResourceLoaderHooks from "../ResourceLoaderHooks";

class TextResource extends Resource<string> {
    public path: string;
    public data!: string;
    public req: XMLHttpRequest;

    private __debugFlag?: boolean;

    constructor(hooks: ResourceLoaderHooks, path: string, __debugFlag?: boolean) {
        super(hooks);
        this.path = path;
        this.__debugFlag = __debugFlag;

        this.req = this.getText(path);
    }

    private getText(path: string): XMLHttpRequest {
        const req = new XMLHttpRequest();
        req.open("GET", path);
        req.responseType = "text";

        req.addEventListener("load", () => {
            this.data = req.responseText;

            if (req.status >= 400) {
                this.onErrorHandler(new Error(
                    "Failed to load " + this.path + ": " +
                    req.status + " (" + req.statusText + ")"
                ));
            } else {
                this.onLoadHandler();
            }
        });

        req.addEventListener("error", () => {
            this.onErrorHandler(new Error("Failed to load " + this.path + ", not connected to internet?"));
        });


        if (!this.__debugFlag)
            req.send();
        return req;
    }
}

export default TextResource;