import Resource from "./Resource";
import ResourceLoaderHooks from "../ResourceLoaderHooks";

class JSONResource extends Resource<any> {
    public path: string;
    public data!: any;

    constructor(hooks: ResourceLoaderHooks, path: string, __debugFlag?: boolean) {
        super(hooks);
        this.path = path;

        if (!__debugFlag)
            this.getJSON(path);
    }

    private getJSON(path: string): void {
        const req = new XMLHttpRequest();
        req.open("GET", path);
        req.responseType = "text";

        req.addEventListener("load", () => {
            if (req.status >= 400) {
                this.onErrorHandler(new Error(
                    "Failed to load " + this.path + ": " +
                    req.status + " (" + req.statusText + ")"
                ));
                return;
            }

            try {
                this.data = JSON.parse(req.responseText);
            } catch (err) {
                this.onErrorHandler(err as any);
                return;
            }

            this.onLoadHandler();
        });

        req.addEventListener("error", () => {
            this.onErrorHandler(new Error("Failed to load " + this.path + ", not connected to internet?"));
        });

        req.send();
    }
}

export default JSONResource;