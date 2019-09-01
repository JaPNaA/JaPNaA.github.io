import IAppEventsMan from "./IAppEventsMan";

export default interface IAppEvents extends IAppEventsMan {
    dispatchViewChange(): void;
}