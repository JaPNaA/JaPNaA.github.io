import { Rect, newRect } from "../../../types/math/rect";
import createArray from "../../../utils/createArray";
import { ElementData, GridElementPosition, createGridElementPosition, createElementData } from "./types";

class GridElementManager<T> {
    private static tolerance: number = 1;

    private grid: (T | null)[][];
    private allElements: ElementData<T>[];

    private gridColumns: number;
    private gridRows: number;
    private firstOpenRow: number;

    private width: number;
    private rowHeight: number;
    private minElmWidth: number;

    /**
     * @param columns Number of columns in grid
     * @param width The real pixel width of the grid
     * @param rowHeight The real pixel height of a row
     * @param minElmWidth Min size of element on grid, used for optimization
     */
    constructor(columns: number, width: number, rowHeight: number, minElmWidth: number) {
        this.gridColumns = columns;
        this.gridRows = 0;
        this.width = width;
        this.rowHeight = rowHeight;
        this.allElements = [];
        this.grid = [];
        this.minElmWidth = minElmWidth;
        this.firstOpenRow = 0;

        this.addGridRow();
    }

    public addElement(element: T, width: number, height: number) {
        const elmData = createElementData(element, width, height);
        this.allElements.push(elmData);

        const position = this.findPositionForElementWithWidth(width);
        const finalPosition = this.putElementOnPosition(elmData, position);
        return this.scaleRectToReal(finalPosition);
    }

    private findPositionForElementWithWidth(width: number): GridElementPosition {
        const { possibleRanges, maxRangeWidth } = this.getPossibleRanges();

        if (maxRangeWidth < width) {
            return this.findPositionForElementWithWidthTooBig(width, possibleRanges);
        } else {
            return this.findPositionForElementWithWidthBigEnough(width, possibleRanges);
        }
    }

    private findPositionForElementWithWidthTooBig(width: number, possibleRanges: GridElementPosition[]): GridElementPosition {
        let maxWidth = 0;
        let widestRange = null;

        for (const range of possibleRanges) {
            const rangeWidth = range.width;
            if (rangeWidth > maxWidth) {
                maxWidth = rangeWidth;
                widestRange = range;
            }
        }

        if (!widestRange) {
            this.addGridRow();
            return createGridElementPosition(0, this.gridRows - 1, width);
        }

        return widestRange;
    }

    private findPositionForElementWithWidthBigEnough(width: number, possibleRanges: GridElementPosition[]): GridElementPosition {
        let minWidth = this.gridColumns + 1;
        let smallestAvailableRange = null as any as GridElementPosition;

        for (const range of possibleRanges) {
            const rangeWidth = range.width;
            if (rangeWidth >= width && rangeWidth < minWidth) {
                minWidth = rangeWidth;
                smallestAvailableRange = range;
            }
        }

        if (smallestAvailableRange.width - width > GridElementManager.tolerance) {
            return createGridElementPosition(
                smallestAvailableRange.x,
                smallestAvailableRange.y,
                width
            );
        } else {
            return smallestAvailableRange as GridElementPosition;
        }
    }

    /**
     * Places an element somewhere
     * @param elm Element data
     * @param position Where to put it
     * @returns The final rectangle of the placed element
     */
    private putElementOnPosition(elm: ElementData<T>, position: GridElementPosition): Rect {
        for (let yOffset = 0; yOffset < elm.height; yOffset++) {
            const y = yOffset + position.y;
            if (y >= this.gridRows) { this.addGridRow(); }
            let gridRow = this.grid[y];

            for (let x = 0; x < position.width; x++) {
                gridRow[x + position.x] = elm.elm;
            }
        }

        this.updateFirstOpenRow();

        return newRect(position.x, position.y, position.width, elm.height);
    }

    private updateFirstOpenRow() {
        const lastBlockIndexes = this.getLastBlockIndexes();

        this.firstOpenRow = 0;

        for (let y = this.gridRows - 1; y >= 0; y--) {
            let amountStillOpen = 0;
            for (const lastBlockIndex of lastBlockIndexes) {
                if (lastBlockIndex < y) { amountStillOpen++; }
            }

            if (amountStillOpen >= this.minElmWidth) {
                this.firstOpenRow = y;
            } else {
                break;
            }
        }
    }

    private getPossibleRanges(): { possibleRanges: GridElementPosition[], maxRangeWidth: number } {
        const possibleRanges: GridElementPosition[] = [];
        const lastBlockIndexes = this.getLastBlockIndexes();

        for (let y = this.firstOpenRow; y < this.gridRows; y++) {
            let startX: number | undefined;

            let open = false;
            for (let x = 0; x < this.gridColumns; x++) {
                open = lastBlockIndexes[x] < y;
                if (open) {
                    if (startX === undefined) {
                        startX = x;
                    }
                } else {
                    if (startX !== undefined) {
                        possibleRanges.push(createGridElementPosition(startX, y, x - startX));
                        startX = undefined;
                    }
                }
            }

            if (open && startX !== undefined) {
                possibleRanges.push(createGridElementPosition(startX, y, this.gridColumns - startX));
            }
        }

        let maxRangeWidth = 0;

        for (const range of possibleRanges) {
            if (range.width > maxRangeWidth) {
                maxRangeWidth = range.width;
            }
        }

        return { possibleRanges, maxRangeWidth };
    }

    /**
     * Gets the index of the last block on the grid from the bottom
     */
    private getLastBlockIndexes(): number[] {
        const lastBlockIndexes = createArray(this.gridColumns, -1);

        for (let x = 0; x < this.gridColumns; x++) {
            for (let y = this.gridRows - 1; y >= 0; y--) {
                if (this.grid[y][x] !== null) {
                    lastBlockIndexes[x] = y;
                    break;
                }
            }
        }

        return lastBlockIndexes;
    }

    private scaleRectToReal(rect: Rect): Rect {
        return {
            x: rect.x * this.width / this.gridColumns,
            y: rect.y * this.rowHeight,
            width: rect.width * this.width / this.gridColumns,
            height: rect.height * this.rowHeight
        };
    }

    private addGridRow() {
        const arr = [];
        for (let i = 0; i < this.gridColumns; i++) {
            arr[i] = null;
        }

        this.gridRows = this.grid.push(arr);
    }
}

export default GridElementManager;