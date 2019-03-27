import IApp from "../../types/app";

abstract class View {
    protected abstract elm: HTMLElement;

    protected app: IApp;
    protected isFullPage: boolean;

    public viewName?: string;
    public showGlobalWidget: boolean = true;

    constructor(app: IApp) {
        this.app = app;
        this.isFullPage = false;
    }

    public setup(): void {
        const viewName = this.viewName || this.constructor.name;

        this.elm.classList.add("view");
        this.elm.classList.add(viewName);

        if (this.isFullPage) {
            this.app.url.pushState(viewName);
            this.updateStateURL();
        }

        console.log("setup " + this.viewName);
    }

    /**
     * Opposite of setup.
     * @returns a promise that resolves when the scene's
     * destruction animation finishes, signifying that 
     * it's safe to remove the element.
     */
    public async destory(): Promise<void> {
        console.log("destory " + this.viewName);
    }

    /** Appends scene element to element */
    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.elm);
    }

    /** Appends scene to element as first child */
    public appendAtStartTo(parent: HTMLElement) {
        parent.insertBefore(this.elm, parent.firstChild);
    }

    /** Removes scene element from element */
    public removeFrom(parent: HTMLElement) {
        parent.removeChild(this.elm);
    }

    /** Returns if the view can be scrolled */
    public canScroll(): boolean {
        return this.elm.scrollHeight > this.elm.clientHeight;
    }

    /** Resizes the view */
    public resize(width: number, height: number): void {
        //
    }

    /** Updates the URL state */
    protected updateStateURL(): void {
        if (this.isFullPage) {
            this.app.url.setState(this.viewName as string);
        }
    }
}

export default View;