import HexagonsTitle from "./HexagonsTitle";
import IApp from "../../../core/types/app/IApp";
import HexagonsRenderer from "../../../components/hexagons/HexagonsRenderer";
import HexagonTitleHexagon from "./HexagonsTitleHexagon";
import Logo from "./Logo";
import { easeInOutExp } from "../../../utils/easingFunctions";
import siteConfig from "../../../SiteConfig";

class HexagonsTitleRenderer extends HexagonsRenderer {
    protected autoClearOnDraw = false;

    private static transitionInTime = 1800;

    private hexagonsTitle: HexagonsTitle;
    private logo: Logo;
    private gradient: CanvasGradient;

    private transitionStep: number;
    private drawLogoOver: boolean;

    constructor(app: IApp, hexagonsTitle: HexagonsTitle) {
        super(app, HexagonTitleHexagon);
        this.hexagonsTitle = hexagonsTitle;
        this.logo = new Logo(this.width, this.height);
        this.transitionStep = 0;
        this.drawLogoOver = false;
        this.gradient = this.createGradient();

        this.logo.ready()
            .then(() => {
                this.requestDraw();
            });
    }

    public noTransitionIn(): void {
        this.transitionStep = 1;
    }

    public updateSize(): void {
        const width = this.hexagonsTitle.width;
        const height = this.hexagonsTitle.height;
        this.logo.resize(width, height);
        this.renderSystem.setCenter(width / 2, height / 2);
        this.gradient = this.createGradient();
        this.drawLogoOver = height > width || height < 480;
        super.updateSize();
    }

    protected tick(deltaTime: number): void {
        super.tick(deltaTime);

        this.transitionStep += deltaTime / HexagonsTitleRenderer.transitionInTime;

        if (this.transitionStep > 1) {
            this.transitionStep = 1;
        } else {
            this.requestDraw();
        }

        this.updateZoomTransitionState();
    }

    protected draw(X: CanvasRenderingContext2D): void {
        const width = this.hexagonsTitle.width;
        const height = this.hexagonsTitle.height;

        X.clearRect(0, 0, this.width, this.height);

        X.fillStyle = this.gradient;
        X.fillRect(0, 0, width, height);

        if (!this.drawLogoOver) {
            this.logo.draw(X, width / 2, height / 2);
        }

        super.draw(X);

        if (this.drawLogoOver) {
            this.logo.draw(X, width / 2, height / 2);
        }
    }

    protected getNewSize(): [number, number] {
        return HexagonsTitleRenderer.getSizeOfHexagonsTitle(this.hexagonsTitle);
    }

    protected isVisible(): boolean {
        const bbox = this.canvas.getBoundingClientRect();
        if (bbox.top + bbox.height > 0) {
            return true;
        } else {
            return false;
        }
    }

    private static getSizeOfHexagonsTitle(hexagonsTitle: HexagonsTitle): [number, number] {
        if (hexagonsTitle) {
            return [
                innerWidth + hexagonsTitle.overSizeWidth,
                innerHeight + hexagonsTitle.overSizeHeight
            ];
        } else {
            return [innerWidth, innerHeight];
        }
    }

    private createGradient(): CanvasGradient {
        // BUG: createGradient is called *after* drawing when resizing
        const gradient: CanvasGradient = this.getContext().createLinearGradient(0, 0, 0, this.hexagonsTitle.height);
        gradient.addColorStop(0, "rgba(0, 255, 138, 0.239)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        return gradient;
    }

    private updateZoomTransitionState(): void {
        const t = easeInOutExp(this.transitionStep);

        for (let i = 0; i < this.hexagonLayers.length; i++) {
            const layer = this.hexagonLayers[i];
            const scale = siteConfig.hexagons.zoomDistance * (i + 1) * (1 - t) + 1;

            if (t < siteConfig.hexagons.fadeInSpeed) {
                layer.opacity = t * 1 / siteConfig.hexagons.fadeInSpeed;
            } else {
                layer.opacity = 1;
            }

            layer.scale = scale;
        }
    }
}

export default HexagonsTitleRenderer;