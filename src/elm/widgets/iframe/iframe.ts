import Widget from "../widget";
import WidgetMap from "../widgetMap";
import wait from "../../../utils/wait";
import EventHandlers from "../../../utils/events/eventHandlers";
import Handler from "../../../utils/events/handler";

class IFrame extends Widget {
    public static widgetName = "iframe";
    public widgetName = IFrame.widgetName;
    protected elm: HTMLIFrameElement;

    private eventHandlers: EventHandlers;

    constructor(src: string) {
        super();

        this.elm = document.createElement("iframe");
        this.eventHandlers = new EventHandlers();

        this.setSrc(src);
        this.addEventHandlers();
    }

    public setSrc(src: string): void {
        this.elm.src = src;
    }

    public close(): void {
        if (this.elm.parentElement) {
            this.elm.parentElement.removeChild(this.elm);
        }
    }

    public tryClose(): void {
        this.elm.src = "about:blank";
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

    public onClose(handler: Handler) {
        this.eventHandlers.add(handler);
    }

    public offClose(handler: Handler) {
        this.eventHandlers.remove(handler);
    }

    private addEventHandlers() {
        this.elm.addEventListener("load", () => {
            if (this.isClosed()) {
                this.eventHandlers.dispatch();
                console.log("close");
            }
        });
    }
}

WidgetMap.add(IFrame);

export default IFrame;