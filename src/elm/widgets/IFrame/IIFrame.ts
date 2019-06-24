import Handler from "../../../core/utils/events/handler";
import Widget from "../../../core/widget/widget";

export default interface IIFrame extends Widget {
    widgetName: string;
    setSrc(src: string): void;
    focus(): void;
    close(): void;
    tryClose(): void;
    isClosed(): boolean;
    onClose(handler: Handler): void;
    offClose(handler: Handler): void;
}