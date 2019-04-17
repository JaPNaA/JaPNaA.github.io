import CanvasButton from "../../../../components/canvasElements/canvasButton";
import SiteResources from "../../../../siteResources";
import SiteConfig from "../../../../siteConfig";
import ImageViewImage from "./image";
import SimpleEasePhysics from "../../../../components/canvasElements/physics/simpleEase";

class ImageViewCloseButton extends CanvasButton {
    public static width: number = 32;
    public static height: number = 32;

    protected physics?: SimpleEasePhysics;
    private image: HTMLImageElement;
    private imageViewImage: ImageViewImage;

    constructor(imageViewImage: ImageViewImage) {
        super(0, 0, ImageViewCloseButton.width, ImageViewCloseButton.height);
        this.imageViewImage = imageViewImage;
        this.image = SiteResources.loadImage(SiteConfig.path.img.close).image;
    }

    public attachPhysics(physics: SimpleEasePhysics) {
        super.attachPhysics(physics);
    }

    public draw(X: CanvasRenderingContext2D): void {
        X.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    public tick(dt: number) {
        super.tick(dt);

        const imageRect = this.imageViewImage.getRect();
        if (imageRect && this.physics) {
            if (
                imageRect.x - this.rect.width < 0 ||
                imageRect.y - this.rect.height < 0
            ) {
                this.physics.moveTo(0, 0);
            } else {
                this.physics.teleportTo(imageRect.x - ImageViewCloseButton.width, imageRect.y - ImageViewCloseButton.height);
            }
        }
    }
}

export default ImageViewCloseButton;