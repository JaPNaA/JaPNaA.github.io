import Resource from "./Resource";
import ResourceLoaderHooks from "../ResourceLoaderHooks";

class XMLResource extends Resource<Document> {
    public path: string;
    public data!: Document;

    private type: SupportedType;

    constructor(hooks: ResourceLoaderHooks, path: string, type?: SupportedType) {
        super(hooks);
        this.path = path;
        this.type = type || "text/xml";

        this.getXML(path);
    }

    private getXML(path: string): void {
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

            const parser = new DOMParser();
            this.data = parser.parseFromString(req.responseText, this.type);

            this.onLoadHandler();
        });

        req.addEventListener("error", () => {
            this.onErrorHandler(new Error("Failed to load " + this.path + ", not connected to internet?"));
        });

        req.send();
    }
}

export default XMLResource;
