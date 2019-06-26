import siteResources from "../../../core/siteResources";
import siteConfig from "../../../SiteConfig";
import ImageResource from "../../../core/components/resourceLoader/resources/ImageResource";

class Logo {
    private static readonly padding = 32;

    private resource: ImageResource;
    private img: HTMLImageElement;
    private maxWidth: number = 0;
    private maxHeight: number = 0;

    constructor(maxWidth: number, maxHeight: number) {
        this.resource = siteResources.loadImage(siteConfig.path.img.logo);
        this.img = this.resource.data;
        this.resize(maxWidth, maxHeight);
    }

    public resize(maxWidth: number, maxHeight: number) {
        this.maxWidth = maxWidth - Logo.padding * 2;
        this.maxHeight = maxHeight - Logo.padding * 2;
    }

    public draw(X: CanvasRenderingContext2D, centerX: number, centerY: number) {
        const scale = Math.min(1, this.maxWidth / this.img.width, this.maxHeight / this.img.height);

        const imgWidth = this.img.width * scale;
        const imgHeight = this.img.height * scale;

        X.drawImage(
            this.img, // 0, 0, this.img.width, this.img.height,
            centerX - imgWidth / 2,
            centerY - imgHeight / 2,
            imgWidth,
            imgHeight
        );
    }
}

export default Logo;