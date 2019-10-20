import IAppURL from "./IAppURL";
import IAppEvents from "./IAppEvents";
import IAppViews from "./IAppViews";
import ViewDescriptor from "../view/ViewDescriptor";
import Router from "../../components/router/Router";

export default interface IApp {
    title: string;
    width: number;
    height: number;

    url: IAppURL;
    events: IAppEvents;
    views: IAppViews;
    indexRouter: Router;

    view404?: ViewDescriptor;
    viewError?: ViewDescriptor;

    setup(): Promise<void>;
    destory(): Promise<void>;
    top(): IApp;
    focus(): void;
}