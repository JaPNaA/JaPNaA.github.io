class Hexagon {
    public static baseWidth = 64;
    public static baseHeight = 64;
    public static rotationMax = Math.PI * 2 / 6;

    public x: number;
    public y: number;
    public vx: number;
    public vy: number;

    public rotation: number;
    public vrotation: number;

    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.rotation = Math.random();
        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;
        const scale = Math.random() + 0.1;
        this.width = scale * Hexagon.baseWidth;
        this.height = scale * Hexagon.baseHeight;
        this.vrotation = (Math.random() - 0.5) * 0.1;
    }
}

export default Hexagon;