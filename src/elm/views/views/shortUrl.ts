import View from "../view";
import ViewMap from "../viewMap";
import IApp from "../../../types/app/iApp";

class ShortUrlView extends View {
    public static viewName = "#";
    public viewName = ShortUrlView.name;

    protected elm: HTMLDivElement;

    private hash: string;

    constructor(app: IApp, hash?: string) {
        super(app);
        if (!hash) { throw new Error("No hash provided"); }

        this.elm = document.createElement("div");
        this.hash = hash;
    }

    public setup(): void {
        super.setup();
        this.elm.innerHTML = this.hash;
    }
}

ViewMap.add(ShortUrlView);

export default ShortUrlView;