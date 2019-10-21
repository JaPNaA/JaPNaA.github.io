abstract class Widget {
    protected abstract elm: Element;
    protected parent?: Element;
    public cssName?: string;

    constructor() { }

    public setup(): void {
        const widgetName = this.cssName || this.constructor.name;

        this.elm.classList.add("widget");
        this.elm.classList.add(widgetName);

        this.cssName = widgetName;
    }

    public destory(): void { }

    public appendTo(parent: Element): void {
        this.parent = parent;
        parent.appendChild(this.elm);
    }

    public canScroll(): boolean {
        return this.elm.scrollHeight > this.elm.clientHeight;
    }
}

export default Widget;