class Hexagon {
    public x: number;
    public y: number;

    constructor() {
        do {
            this.x = Math.random();
            this.y = Math.random();
        } while (this.y > 2 * this.x * this.x + 0.1);
    }
}

export default Hexagon;