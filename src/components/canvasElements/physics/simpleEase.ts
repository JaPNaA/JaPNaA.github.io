import CanvasElementPhysics from "./physics";
import absSum from "../../../utils/absSum";

class SimpleEasePhysics extends CanvasElementPhysics {
    private static changedThreshold = 0.0001;

    private targetX: number;
    private targetY: number;
    private transitionSpeed: number;
    private totalDiff: number;

    constructor(transitionSpeed: number) {
        super();
        this.targetX = 0;
        this.targetY = 0;
        this.transitionSpeed = transitionSpeed;
        this.totalDiff = 0;
    }

    protected onAttach(): void {
        this.targetX = this.rect.x;
        this.targetY = this.rect.y;
    }

    public moveTo(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
    }

    public teleportTo(x: number, y: number): void {
        this.targetX = this.rect.x = x;
        this.targetY = this.rect.y = y;
    }

    public rectChanged(): boolean {
        return this.totalDiff > SimpleEasePhysics.changedThreshold;
    }

    public tick(dt: number): void {
        const dx = this.targetX - this.rect.x;
        const dy = this.targetY - this.rect.y;
        this.rect.x += dx * this.transitionSpeed;
        this.rect.y += dy * this.transitionSpeed;
        this.totalDiff = absSum([dx, dy]);
    }

    public onDraw(): void { }
}

export default SimpleEasePhysics;