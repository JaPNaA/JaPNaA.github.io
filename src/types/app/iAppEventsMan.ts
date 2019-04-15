import Handler from "../../utils/events/handler";

export default interface IAppEventsMan {
    onViewChange(handler: Handler): void;
    offViewChange(handler: Handler): void;
    onResize(handler: Handler): void;
    offResize(handler: Handler): void;
}