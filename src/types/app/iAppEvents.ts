import IAppEventsHandlers from "./iAppEventsMan";

export default interface IAppEvents extends IAppEventsHandlers {
    dispatchViewChange(): void;
}