import siteConfig from "../../SiteConfig";

abstract class Hexagon {
    public static readonly expectedHexagonColor: string = "rgba(0,189,114,0.65)";
    public static readonly baseSize: number = 256;
    public static readonly negHalfBaseSize: number = -Hexagon.baseSize / 2;
    public static readonly baseHue: number = 149;

    public size: number;
    public x: number;
    public y: number;
    public z: number;
    public rotation: number;

    constructor(z: number) {
        this.z = z;
        this.rotation = Math.random();

        this.x = Math.random();
        this.y = Math.random();

        const size = Math.random();
        this.size = (size + (z + 1) / siteConfig.hexagons.layers) * siteConfig.hexagons.layerSizeFactor + siteConfig.hexagons.minHexagonSize;
        this.size *= this.size;
        this.size *= this.size;
        this.size *= ((z + 1) / siteConfig.hexagons.layers) *
            siteConfig.hexagons.hexagonsSize;
    }
}

export default Hexagon;