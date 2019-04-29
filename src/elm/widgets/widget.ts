abstract class Widget {
    protected abstract elm: Element;
    protected parent?: Element;
    public widgetName?: string;

    constructor() { }

    public setup(): void {
        const widgetName = this.widgetName || this.constructor.name;

        this.elm.classList.add("widget");
        this.elm.classList.add(widgetName);

        this.widgetName = widgetName;
    }

    public destory(): void { }

    public appendTo(parent: Element): void {
        this.parent = parent;
        parent.appendChild(this.elm);
    }
}

export default Widget;