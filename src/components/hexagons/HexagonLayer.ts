import Hexagon from "./Hexagon";

class HexagonLayer {
    public hexagons: Hexagon[];
    public offsetTop: number;
    public scale: number;
    public opacity: number;

    constructor(HexagonType: new (z: number) => Hexagon, z: number, amount: number) {
        this.hexagons = [];
        this.offsetTop = 0;
        this.scale = 1;
        this.opacity = 1;

        for (let i = 0; i < amount; i++) {
            this.hexagons.push(new HexagonType(z));
        }
    }
}

export default HexagonLayer;