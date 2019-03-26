import Resource from "./resource";
import ResourceLoaderHooks from "../resourceLoaderHooks";
import { JSONObject } from "../../../types/jsonObject";

class JSONResource extends Resource {
    public path: string;
    public data?: any;

    constructor(hooks: ResourceLoaderHooks, path: string) {
        super(hooks);
        this.path = path;

        this.getJSON(path);
    }

    private getJSON(path: string): void {
        const req = new XMLHttpRequest();
        req.open("GET", path);
        req.responseType = "text";

        req.addEventListener("load", () => {
            this.data = JSON.parse(req.responseText);

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

        req.send();
    }
}

export default JSONResource;