import css from "../../../styles/index.less";

import IApp from "../types/app/IApp";
import IAppURL from "../types/app/IAppURL";
import AppEvents from "./components/AppEvents";
import AppViews from "./components/AppViews";
import getFirstScrollableParent from "../utils/getFirstScrollableParent";
import Router from "../components/router/Router";

abstract class BaseApp implements IApp {
    public abstract title: string;
    public view404?: string;
    public viewError?: string;

    public width: number;
    public height: number;

    protected mainElm: HTMLDivElement;

    public abstract url: IAppURL;
    public abstract routes: Router;
    public events: AppEvents;
    public views: AppViews;
    public parentApp?: IApp;

    constructor(parentApp?: IApp) {
        this.width = innerWidth;
        this.height = innerHeight;
        this.parentApp = parentApp;

        this.mainElm = document.createElement("div");
        this.mainElm.classList.add(css.main);
        this.mainElm.tabIndex = -1; // this makes the app element focusable

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

    public focus(): void {
        const firstScrollable = getFirstScrollableParent(this.mainElm);
        if (!firstScrollable) { return; }
        const x = firstScrollable.scrollTop;
        const y = firstScrollable.scrollLeft;
        this.mainElm.focus({
            preventScroll: true
        });
        firstScrollable.scrollTo(x, y);
    }

    public async setup(): Promise<void> { }
    public async destory(): Promise<void> { }
}

export default BaseApp;