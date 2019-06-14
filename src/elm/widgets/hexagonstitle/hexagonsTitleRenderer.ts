import LazyCanvasRenderer from "../../../components/canvas/renderer/lazyCanvasRenderer";
import HexagonsTitle from "./hexagonstitle";
import IApp from "../../../core/types/app/iApp";

class HexagonsTitleRenderer extends LazyCanvasRenderer {
    public hexagonsTitle: HexagonsTitle;
    private justScrolled = false;

    constructor(app: IApp, hexagonsTitle: HexagonsTitle) {
        super(app, ...HexagonsTitleRenderer.getSizeOfHexagonsTitle(hexagonsTitle));
        this.hexagonsTitle = hexagonsTitle;
    }

    public drawOnScroll(): void {
        this.justScrolled = true;
        this.drawIfShould();
    }

    protected hasChanged(): boolean {
        const justScolled = this.justScrolled;
        this.justScrolled = false;
        return justScolled;
    }

    protected tick(deltaTime: number): void {
        this.hexagonsTitle.tick(deltaTime);
    }

    protected draw(X: CanvasRenderingContext2D): void {
        X.clearRect(0, 0, this.width, this.height);
        this.hexagonsTitle.draw(X);
    }

    protected getNewSize(): [number, number] {
        return HexagonsTitleRenderer.getSizeOfHexagonsTitle(this.hexagonsTitle);
    }

    protected isVisible(): boolean {
        const bbox = this.canvas.getBoundingClientRect();
        if (bbox.top + bbox.height > 0) {
            return true;
        } else {
            return false;
        }
    }

    private static getSizeOfHexagonsTitle(hexagonsTitle: HexagonsTitle): [number, number] {
        return [
            innerWidth + hexagonsTitle.overSizeWidth,
            innerHeight + hexagonsTitle.overSizeHeight
        ];
    }
}

export default HexagonsTitleRenderer;