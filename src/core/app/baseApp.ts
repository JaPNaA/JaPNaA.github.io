import IApp from "../types/app/iApp";
import AppEvents from "./components/events";
import AppViews from "./components/views";
import IAppURL from "../types/app/iAppURL";
import ViewDescriptor from "../types/app/viewDescriptor";

abstract class BaseApp implements IApp {
    public abstract title: string;
    public view404?: ViewDescriptor;
    public width: number;
    public height: number;

    protected mainElm: HTMLDivElement;

    public abstract url: IAppURL;
    public events: AppEvents;
    public views: AppViews;
    public parentApp?: IApp;

    constructor(parentApp?: IApp) {
        this.width = innerWidth;
        this.height = innerHeight;
        this.parentApp = parentApp;

        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");

        this.events = new AppEvents(this);
        this.views = new AppViews(this, this.events, this.mainElm);
    }

    public top(): IApp {
        if (this.parentApp) {
            return this.parentApp.top();
        } else {
            return this;
        }
    }

    public async setup(): Promise<void> { }

    public async destory(): Promise<void> { }
}

export default BaseApp;