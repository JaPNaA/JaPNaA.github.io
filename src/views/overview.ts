import "../../styles/views/overview.less";

import View from "./_view";
import App from "../app";
import ViewMap from "./_list";
import HexagonsTitle from "../components/hexagonsTitle/hexagonsTitle";

class Overview extends View {
    public static viewName = "Overview";
    public viewName = Overview.viewName;

    public isFullPage = true;
    
    protected elm: HTMLDivElement;

    private hexagonsTitle: HexagonsTitle;

    constructor(app: App) {
        super(app);
        this.elm = document.createElement("div");
        this.hexagonsTitle = new HexagonsTitle();
    }

    public setup() {
        super.setup();

        this.hexagonsTitle.appendTo(this.elm);
        this.hexagonsTitle.setOverSize(0, 128);
        this.hexagonsTitle.registerEventHandlers();
    }

    public async destory(): Promise<void> {
        super.destory();
        this.hexagonsTitle.destory();
    }
}

ViewMap.add(Overview);

export default Overview;