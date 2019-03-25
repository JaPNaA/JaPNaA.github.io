import Widget from "../widget";
import WidgetMap from "../widgetMap";

class IFrame extends Widget {
    public static widgetName = "iframe";
    public widgetName = IFrame.widgetName;
    protected elm: HTMLIFrameElement;

    constructor(src: string) {
        super();

        this.elm = document.createElement("iframe");
        this.setSrc(src);
    }

    public setSrc(src: string): void {
        this.elm.src = src;
    }

    public close(): void {
        if (this.elm.parentElement) {
            this.elm.parentElement.removeChild(this.elm);
        }
        this.tryClose();
    }

    public tryClose(): boolean {
        this.elm.src = "about:blank";
        return this.isClosed();
    }

    public isClosed(): boolean {
        try {
            return Boolean(this.elm.contentWindow && this.elm.contentWindow.location.href === "about:blank");
        } catch (err) {
            if (err instanceof DOMException && err.code === err.SECURITY_ERR) {
                return false;
            } else {
                throw err;
            }
        }
    }
}

WidgetMap.add(IFrame);

export default IFrame;