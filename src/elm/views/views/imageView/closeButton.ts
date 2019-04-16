import CanvasButton from "../../../../components/canvasElements/canvasButton";
import SiteResources from "../../../../siteResources";
import SiteConfig from "../../../../siteConfig";

class CloseButton extends CanvasButton {
    public static width: number = 32;
    public static height: number = 32;

    private image: HTMLImageElement;

    constructor() {
        super(0, 0, CloseButton.width, CloseButton.height);
        this.image = SiteResources.loadImage(SiteConfig.path.img.close).image;
    }

    public draw(X: CanvasRenderingContext2D): void {
        X.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

export default CloseButton;