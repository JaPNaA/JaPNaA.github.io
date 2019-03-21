abstract class Widget {
    protected abstract elm: HTMLElement;
    public widgetName?: string;

    constructor() { }

    public setup(): void {
        const widgetName = this.widgetName || this.constructor.name;

        this.elm.classList.add("widget");
        this.elm.classList.add(widgetName);
    }

    public destory(): void { }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.elm);
    }
}

export default Widget;