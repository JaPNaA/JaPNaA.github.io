import SiteResources from "../../../core/siteResources";
import SiteConfig from "../../../siteConfig";
import ImageResource from "../../../core/components/resourceLoader/resources/image";

class Logo {
    private resource: ImageResource;
    private img: HTMLImageElement;

    constructor() {
        this.resource = SiteResources.loadImage(SiteConfig.path.img.logo);
        this.img = this.resource.image;
    }

    public draw(X: CanvasRenderingContext2D, centerX: number, centerY: number) {
        X.drawImage(
            this.img,
            centerX - this.img.width / 2,
            centerY - this.img.height / 2
        );
    }
}

export default Logo;