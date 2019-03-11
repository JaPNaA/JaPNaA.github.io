import View from "./_view";
import App from "../app";
import ViewMap from "./_list";

class View404 extends View {
    public static viewName = "View404";
    public viewName = View404.viewName;

    protected elm: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected isFullPage = false;

    private X: CanvasRenderingContext2D;
    private mouseX: number;
    private mouseY: number;
    private width: number;
    private height: number;

    constructor(app: App) {
        super(app);

        this.elm = document.createElement("div");

        this.canvas = this.createCanvas();
        this.X = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;

        this.elm.appendChild(this.canvas);
    }

    public setup(): void {
        super.setup();

        if (this.X) {
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
            this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
            this.draw();
        }

        this.resizeHandler = this.resizeHandler.bind(this);
        addEventListener("resize", this.resizeHandler);
    }

    public async destory(): Promise<void> {
        await super.destory();

        if (this.X) {
            this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        }

        removeEventListener("resize", this.resizeHandler);
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        return canvas;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        this.mouseX = e.layerX;
        this.mouseY = e.layerY;
        this.draw();
    }

    private resizeHandler(): void {
        this.canvas.width = this.width = innerWidth;
        this.canvas.height = this.height = innerHeight;
        this.draw();
    }

    private draw(): void {
        this.X.globalCompositeOperation = "source-over";
        this.X.fillStyle = "#242424";
        this.X.fillRect(0, 0, this.canvas.width, this.canvas.height);

        var GRA: CanvasGradient = this.X.createRadialGradient(this.mouseX, this.mouseY, 84, this.width / 2, 0, 0);
        GRA.addColorStop(0, "#4F4F4F");
        GRA.addColorStop(1, "#FFFFFF");

        this.X.fillStyle = GRA;
        this.X.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.X.textBaseline = "middle";
        this.X.textAlign = "center";
        this.X.fillStyle = "#000000";
        this.X.font = "128px Consolas, monospace";
        this.X.globalCompositeOperation = "destination-atop";
        this.X.fillText("404", this.width / 2, this.height / 2);
    }
}

ViewMap.add(View404);

export default View404;