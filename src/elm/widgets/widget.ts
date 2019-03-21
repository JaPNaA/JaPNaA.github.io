abstract class Widget {
    protected abstract elm: HTMLElement;
    protected parent?: HTMLElement;
    public widgetName?: string;

    constructor() { }

    public setup(): void {
        const widgetName = this.widgetName || this.constructor.name;

        this.elm.classList.add("widget");
        this.elm.classList.add(widgetName);
    }

    public destory(): void { }

    public appendTo(parent: HTMLElement): void {
        this.parent = parent;
        parent.appendChild(this.elm);
    }
}

export default Widget;