import IPositionable from "./types/IPositionable";
import DynamicGridCore from "./DynamicGridCore";
import { Rect } from "../../types/math/Rect";

class DynamicGridDisplay<T extends IPositionable> extends DynamicGridCore<T> {
    private rowHeight: number;
    private columnWidth: number;

    constructor(columns: number, width: number, rowHeight: number, minElmWidth?: number) {
        super(columns, minElmWidth);

        this.columnWidth = width / this.gridColumns;
        this.rowHeight = rowHeight;
    }

    public addElement(element: T, width_: number, height: number): Rect {
        const width = Math.min(width_, this.gridColumns);
        const rect = super.addElement(element, width, height);
        const scaled = this.scaleRectToReal(rect);
        element.setRect(scaled);
        return scaled;
    }

    public resizeGridColumns(columns: number): void {
        super.resizeGridColumns(columns);
        this.callAllElementsToResize();
    }

    public resizeElementSize(width: number, rowHeight: number) {
        this.columnWidth = width / this.gridColumns;
        this.rowHeight = rowHeight;
        this.callAllElementsToResize();
    }

    public getFirstElementAt(y: number): T | null {
        const gridY = Math.ceil(y / this.rowHeight);
        const firstElement = this.getFirstElementInRow(this.grid[gridY]);
        return firstElement;
    }

    public isAfterFirstOpenRow(y: number) {
        return y > this.firstOpenRow * this.rowHeight;
    }

    private scaleRectToReal(rect: Rect): Rect {
        return {
            x: rect.x * this.columnWidth,
            y: rect.y * this.rowHeight,
            width: rect.width * this.columnWidth,
            height: rect.height * this.rowHeight
        };
    }

    private callAllElementsToResize(): void {
        for (const element of this.allElements) {
            if (!element.rect) { return; }
            element.elm.setRect(this.scaleRectToReal(element.rect));
        }
    }

    private getFirstElementInRow(row: (T | null)[] | undefined): T | null {
        if (!row) { return null; }
        for (const item of row) {
            if (item) { return item; }
        }
        return null;
    }
}

export default DynamicGridDisplay;