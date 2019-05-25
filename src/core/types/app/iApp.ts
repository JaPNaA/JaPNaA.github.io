import IAppURL from "./iAppURL";
import IAppEvents from "./iAppEvents";
import IAppViews from "./iAppViews";
import ViewClass from "../view/viewClass";

export default interface IApp {
    title: string;
    width: number;
    height: number;

    url: IAppURL;
    events: IAppEvents;
    views: IAppViews;

    view404?: ViewClass;

    setup(): Promise<void>;
    destory(): Promise<void>;
    top(): IApp;
}