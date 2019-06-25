import Hexagon from "../Hexagon";

abstract class HexagonSystem {
    protected width: number;
    protected height: number;
    protected hexagons: Hexagon[];

    constructor(hexagons: Hexagon[]) {
        this.width = 0;
        this.height = 0;
        this.hexagons = hexagons;
    }

    public abstract run(): void;
    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}

export default HexagonSystem;