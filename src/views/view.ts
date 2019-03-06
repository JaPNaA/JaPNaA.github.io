import App from "../app";
import URLManager from "../components/url/urlMan";

abstract class View {
    protected abstract elm: HTMLElement;

    protected app: App;
    protected isFullPage: boolean;
    
    public viewName?: string;


    constructor(app: App) {
        this.app = app;
        this.isFullPage = false;
    }

    public setup(): void {
        const viewName = this.viewName || this.constructor.name;

        this.elm.classList.add("view");
        this.elm.classList.add(viewName);

        if (this.isFullPage) {
            URLManager.pushState(viewName);
        }
    }

    /**
     * Opposite of setup.
     * @returns a promise that resolves when the scene's
     * destruction animation finishes, signifying that 
     * it's safe to remove the element.
     */
    public async destory(): Promise<void> {
        //
    }

    /** Appends scene element to element */
    public appendTo(elm: HTMLElement) {
        elm.appendChild(this.elm);
    }

    public appendAtStartTo(elm: HTMLElement) {
        elm.insertBefore(this.elm, elm.firstChild);
    }

    /** Removes scene element from element */
    public removeFrom(elm: HTMLElement) {
        elm.removeChild(this.elm);
    }
}

export default View;