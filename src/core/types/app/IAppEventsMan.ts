import Handler from "../../utils/events/Handler";

export default interface IAppEventsMan {
    onViewChange(handler: Handler): void;
    offViewChange(handler: Handler): void;
    onResize(handler: Handler): void;
    offResize(handler: Handler): void;
    onKeydown(handler: Handler<KeyboardEvent>): void;
    offKeydown(handler: Handler<KeyboardEvent>): void;
}