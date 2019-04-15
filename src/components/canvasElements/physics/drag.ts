import CanvasElementPhysics from "./physics";

class DragPhysics extends CanvasElementPhysics {
    public rectChanged(): boolean {
        throw new Error("Method not implemented.");
    }
    public setup(): void {
        throw new Error("Method not implemented.");
    }
    public tick(dt: number): void {
        //
    }
}

export default DragPhysics;