import IAppURL from "./IAppURL";
import IAppEvents from "./IAppEvents";
import IAppViews from "./IAppViews";
import ViewDescriptor from "./ViewDescriptor";

export default interface IApp {
    title: string;
    width: number;
    height: number;

    url: IAppURL;
    events: IAppEvents;
    views: IAppViews;

    view404?: ViewDescriptor;
    viewError?: ViewDescriptor;

    setup(): Promise<void>;
    destory(): Promise<void>;
    top(): IApp;
    focus(): void;
}