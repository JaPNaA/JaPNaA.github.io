import IAppURL from "./iAppURL";
import IAppEvents from "./iAppEvents";
import IAppViews from "./iAppViews";

export default interface IApp {
    width: number;
    height: number;

    url: IAppURL;
    events: IAppEvents;
    views: IAppViews;

    setup(): Promise<void>;
    destory(): Promise<void>;
    top(): IApp;
}