class SaveScroll {
    private privateData: { scrollTop: number };
    private initalScrollTop: number;
    private elm: HTMLElement;

    constructor(privateData: any, elm: HTMLElement) {
        this.privateData = privateData;
        this.initalScrollTop = privateData.scrollTop || 0;
        this.elm = elm;
    }

    public setup(): void {
        this.privateData.scrollTop = this.privateData.scrollTop || 0;
    }

    public destory(): void { }

    public updatePrivateData(): void {
        this.privateData.scrollTop = this.elm.scrollTop;
    }

    public apply(): void {
        this.elm.scrollBy(0, this.initalScrollTop);
    }
}

export default SaveScroll;