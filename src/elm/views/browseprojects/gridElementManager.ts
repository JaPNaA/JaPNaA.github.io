import { Rect } from "../../../types/math/rect";

interface ElementData<T> {
    elm: T;
    width: number;
    height: number;
}

interface GridElementPosition {
    startX: number;
    endX: number;
    y: number;
}

class GridElementManager<T> {
    private gridColumns: number;
    private minElmWidth: number;
    private grid: (T | null)[][];
    private allElements: ElementData<T>[];
    private firstOpenRow: number;
    private gridRows: number;
    private width: number;
    private rowHeight: number;
    private static tolerance: number = 1;

    /**
     * 
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

    private addGridRow() {
        const arr = [];
        for (let i = 0; i < this.gridColumns; i++) {
            arr[i] = null;
        }

        this.gridRows = this.grid.push(arr);
    }

    public addElement(element: T, width: number, height: number) {
        const elmData = {
            elm: element,
            width: width,
            height: height
        };
        this.allElements.push(elmData);
        console.log(elmData);

        const position = this.getRangeForElementWithWidth(width);
        const finalPosition = this.placeElementOnPosition(position, elmData);
        this.updateFirstOpenRow();
        return this.scaleRectToReal(finalPosition);
    }

    private scaleRectToReal(rect: Rect): Rect {
        return {
            x: rect.x * this.width / this.gridColumns,
            y: rect.y * this.rowHeight,
            width: rect.width * this.width / this.gridColumns,
            height: rect.height * this.rowHeight
        };
    }

    private placeElementOnPosition(position: GridElementPosition, elm: ElementData<T>): Rect {
        for (let yOffset = 0; yOffset < elm.height; yOffset++) {
            if (!position) { debugger; }
            const y = yOffset + position.y;
            if (y >= this.gridRows) { this.addGridRow(); }
            let gridRow = this.grid[y];

            for (let x = position.startX; x <= position.endX; x++) {
                gridRow[x] = elm.elm;
            }
        }

        return {
            width: position.endX - position.startX,
            height: elm.height,
            x: position.startX,
            y: position.y
        };
    }

    private updateFirstOpenRow() {
        const dists = new Array(this.gridColumns);

        for (let x = 0; x < this.gridColumns; x++) {
            for (let y = this.gridRows - 1; y >= 0; y--) {
                if (this.grid[y][x] !== null) {
                    dists[x] = y;
                }
            }
        }

        for (let y = this.gridRows - 1; y >= 0; y--) {
            let count = 0;
            for (const dist of dists) {
                if (dist > y) { count++; }
            }
            if (count < this.minElmWidth) {
                this.firstOpenRow = count;
            }
        }
    }

    // TODO: What an ugly function! Refactor this
    private getRangeForElementWithWidth(width: number): GridElementPosition {
        const { possibleRanges, maxRangeWidth } = this.getPossibleRanges();

        if (maxRangeWidth < width) {
            let maxWidth = 0;
            let widestRange = null;

            for (const range of possibleRanges) {
                const rangeWidth = range.endX - range.startX;
                if (rangeWidth > maxWidth) {
                    maxWidth = rangeWidth;
                    widestRange = range;
                }
            }
            console.log(widestRange);

            if (!widestRange) {
                this.addGridRow();
                return {
                    y: this.gridRows - 1,
                    startX: 0,
                    endX: Math.min(width, this.gridColumns)
                };
            }
            console.log(widestRange);
            return widestRange;
        } else {
            let minWidth = this.gridColumns + 1;
            let smallestAvailableRange = null as any as GridElementPosition;

            for (const range of possibleRanges) {
                const rangeWidth = range.endX - range.startX;
                if (rangeWidth >= width && rangeWidth < minWidth) {
                    minWidth = rangeWidth;
                    smallestAvailableRange = range;
                }
            }
            const rangeWidth = smallestAvailableRange.endX - smallestAvailableRange.startX;
            if (rangeWidth - width > GridElementManager.tolerance) {
                return {
                    startX: smallestAvailableRange.startX,
                    endX: smallestAvailableRange.startX + width,
                    y: smallestAvailableRange.y
                }
            }

            console.log(smallestAvailableRange);

            return smallestAvailableRange as GridElementPosition;
        }
    }

    private getPossibleRanges(): { possibleRanges: GridElementPosition[], maxRangeWidth: number } {
        const possibleRanges: GridElementPosition[] = [];
        let maxRangeWidth = 0;

        console.log(this.grid);

        for (let y = this.firstOpenRow; y < this.gridRows; y++) {
            let startX = null;

            for (let x = 0; x < this.gridColumns - 1; x++) {
                if (this.grid[y][x] === null && startX === null) {
                    startX = x;
                } else if (this.grid[y][x] !== null && startX !== null && x - startX >= this.minElmWidth) {
                    console.log(startX, x, y);
                    const width = x - startX;
                    if (maxRangeWidth < width) {
                        maxRangeWidth = width;
                    }
                    possibleRanges.push({
                        startX: startX,
                        endX: x,
                        y: y
                    });
                    startX = null;

                }
            }

            console.log(startX);
            if (startX !== null && (this.gridColumns - 1) - startX >= this.minElmWidth) {
                console.log(startX, "end", y);
                const width = (this.gridColumns - 1) - startX;
                if (maxRangeWidth < width) {
                    maxRangeWidth = width;
                }
                possibleRanges.push({
                    startX: startX,
                    endX: (this.gridColumns - 1),
                    y: y
                });
            }
        }

        console.log(possibleRanges);

        return { possibleRanges, maxRangeWidth };
    }
}

export default GridElementManager;