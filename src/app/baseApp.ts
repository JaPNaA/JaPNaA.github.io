import IApp from "../types/app/iApp";
import AppURL from "./components/url";
import AppEvents from "./components/events";
import AppViews from "./components/views";

abstract class BaseApp implements IApp {
    public width: number;
    public height: number;

    protected mainElm: HTMLDivElement;

    public url: AppURL;
    public events: AppEvents;
    public views: AppViews;

    constructor() {
        this.width = innerWidth;
        this.height = innerHeight;

        this.mainElm = document.createElement("div");
        this.mainElm.classList.add("main");

        this.events = new AppEvents(this);
        this.url = new AppURL(this, this.events);
        this.views = new AppViews(this, this.events, this.mainElm);
    }

    public async setup(): Promise<void> {
        console.log("setup BaseApp");
    }

    public async destory(): Promise<void> {
        console.log("destory BaseApp");
    }
}

export default BaseApp;