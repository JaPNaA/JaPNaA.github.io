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
        // console.log(elmData);
        console.log(this.grid);

        this.updateFirstOpenRow();
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
            const y = yOffset + position.y;
            if (y >= this.gridRows) { this.addGridRow(); }
            let gridRow = this.grid[y];

            for (let x = position.startX; x <= position.endX; x++) {
                gridRow[x] = elm.elm;
            }
        }

        return {
            width: position.endX - position.startX + 1,
            height: elm.height,
            x: position.startX,
            y: position.y
        };
    }

    private updateFirstOpenRow() {
        const lastBlockIndexes = this.getLastBlockIndexes();

        console.log(lastBlockIndexes);

        let firstOpenRowSet = false;

        for (let y = this.gridRows - 1; y >= 0; y--) {
            let count = 0;
            for (const lastBlockIndex of lastBlockIndexes) {
                if (lastBlockIndex < y) { count++; }
            }
            // console.log(count);
            if (count > this.minElmWidth) {
                this.firstOpenRow = y;
                firstOpenRowSet = true;
            }
        }

        if (!firstOpenRowSet) {
            this.firstOpenRow = 0;
        }
    }

    private getLastBlockIndexes(): number[] {
        const lastBlockIndexes = new Array(this.gridColumns);

        for (let x = 0; x < this.gridColumns; x++) {
            for (let y = this.gridRows - 1; y >= 0; y--) {
                if (this.grid[y][x] !== null && lastBlockIndexes[x] === undefined) {
                    lastBlockIndexes[x] = y;
                }
            }
        }

        for (let x = 0; x < this.gridColumns; x++) {
            if (lastBlockIndexes[x] === undefined) {
                lastBlockIndexes[x] = -1;
            }
        }

        return lastBlockIndexes;
    }

    // TODO: What an ugly function! Refactor this
    private getRangeForElementWithWidth(width: number): GridElementPosition {
        const { possibleRanges, maxRangeWidth } = this.getPossibleRanges();

        if (maxRangeWidth < width) {
            let maxWidth = 0;
            let widestRange = null;

            for (const range of possibleRanges) {
                const rangeWidth = range.endX - range.startX + 1;
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
                const rangeWidth = range.endX - range.startX + 1;
                if (rangeWidth >= width && rangeWidth < minWidth) {
                    minWidth = rangeWidth;
                    smallestAvailableRange = range;
                }
            }
            const rangeWidth = smallestAvailableRange.endX - smallestAvailableRange.startX + 1;
            if (rangeWidth - width > GridElementManager.tolerance) {
                const range = {
                    startX: smallestAvailableRange.startX,
                    endX: smallestAvailableRange.startX + width - 1,
                    y: smallestAvailableRange.y
                };
                console.log(range);
                return range;
            }

            console.log(smallestAvailableRange);

            return smallestAvailableRange as GridElementPosition;
        }
    }

    private getPossibleRanges(): { possibleRanges: GridElementPosition[], maxRangeWidth: number } {
        const possibleRanges: GridElementPosition[] = [];
        const lastBlockIndexes = this.getLastBlockIndexes();
        let maxRangeWidth = 0;

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
                        possibleRanges.push({
                            startX: startX,
                            endX: x - 1,
                            y: y
                        });
                        maxRangeWidth = Math.max(maxRangeWidth, x - startX);
                        startX = undefined;
                    }
                }
            }

            if (open && startX !== undefined) {
                possibleRanges.push({
                    startX: startX,
                    endX: this.gridColumns - 1,
                    y: y
                });
                maxRangeWidth = Math.max(maxRangeWidth, this.gridColumns - 1 - startX);
            }
        }

        debugger;

        return { possibleRanges, maxRangeWidth };
    }
}

export default GridElementManager;