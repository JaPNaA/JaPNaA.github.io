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

        X.save();
        if (siteConfig.settings.darkMode) {
            X.filter = "invert(1)";
        }

        if ((imgWidth === 0 || imgHeight === 0) && this.img.complete) {
            try {
                // IE randomly likes to throw `Unexpected call to method or property access.` here
                X.drawImage(
                    this.img,
                    centerX - imgWidth / 2,
                    centerY - imgHeight / 2
                );
            } catch (err) { }
            X.font = "16px 'Roboto', Arial";
            X.fillStyle = "#000000";
            X.fillText(
                "You're using a pretty bad browser (probably Internet Explorer).",
                centerX - 128, centerY - 64
            );
            X.fillText(
                "For that, you get a misaligned logo. (it's a feature not a bug)",
                centerX - 128, centerY - 46
            );
        } else {
            X.drawImage(
                this.img,
                centerX - imgWidth / 2,
                centerY - imgHeight / 2,
                imgWidth,
                imgHeight
            );
        }
        X.restore();
    }
}

export default Logo;