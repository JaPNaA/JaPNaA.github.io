import HexagonsRenderer from "../../../hexagons/HexagonsRenderer";
import HexagonLayer from "../../../hexagons/HexagonLayer";
import HexagonType from "../../../hexagons/HexagonType";

class HexagonsCornerRenderer extends HexagonsRenderer {
    private static widthBreakpoint = 576;
    private static hexagonsAmount = 15;

    protected getNewSize(): [number, number] {
        let width = innerWidth * (2 / 3);
        if (width < HexagonsCornerRenderer.widthBreakpoint) {
            if (innerWidth > HexagonsCornerRenderer.widthBreakpoint) {
                width = HexagonsCornerRenderer.widthBreakpoint;
            } else {
                width = innerWidth;
            }
        }

        return [width, innerHeight];
    }

    protected createHexagonLayer(type: HexagonType, z: number): HexagonLayer {
        return new HexagonLayer(type, z, HexagonsCornerRenderer.hexagonsAmount);
    }
}

export default HexagonsCornerRenderer;