import View from "./_view";
import App from "../app";
import ViewMap from "./_list";
import HexagonsTitle from "../components/hexagonsTitle/hexagonsTitle";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    protected elm: HTMLDivElement;
    public isFullPage = true;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
    }

    public setup() {
        super.setup();

        const hexagonsTitle = new HexagonsTitle();
        hexagonsTitle.appendTo(this.elm);
        hexagonsTitle.draw();
    }
}

ViewMap.add(Overview);

export default Overview;