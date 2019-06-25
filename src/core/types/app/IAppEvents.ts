import IAppEventsHandlers from "./IAppEventsMan";

export default interface IAppEvents extends IAppEventsHandlers {
    dispatchViewChange(): void;
}