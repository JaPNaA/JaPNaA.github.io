import Handler from "../../../core/utils/events/Handler";
import Widget from "../../../core/widget/Widget";

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