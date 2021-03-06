import CanvasButton from "../../../components/canvas/canvasElements/canvasButton";
import siteResources from "../../../core/siteResources";
import siteConfig from "../../../SiteConfig";
import ImageViewImage from "./ImageViewImage";
import SimpleEasePhysics from "../../../components/canvas/canvasElements/physics/simpleEase";
import { easeInOutCubic } from "../../../utils/easingFunctions";
import EventHandlers from "../../../core/utils/events/EventHandlers";
import Handler from "../../../core/utils/events/Handler";

class ImageViewCloseButton extends CanvasButton {
    public static width: number = 32;
    public static height: number = 32;
    private static transitionSpeed: number = 0.005;

    protected physics?: SimpleEasePhysics;
    private image: HTMLImageElement;
    private imageViewImage: ImageViewImage;
    private transitionProgress: number;

    private loadHanders: EventHandlers;

    constructor(imageViewImage: ImageViewImage) {
        super(0, 0, ImageViewCloseButton.width, ImageViewCloseButton.height);
        this.imageViewImage = imageViewImage;
        this.loadHanders = new EventHandlers();
        this.image =
            siteResources.loadImage(siteConfig.path.img.closeWhite)
                .onLoad(() => this.loadHanders.dispatch())
                .data;
        this.transitionProgress = 0;
    }

    public onLoad(handler: Handler) {
        this.loadHanders.add(handler);
    }

    public attachPhysics(physics: SimpleEasePhysics) {
        super.attachPhysics(physics);
    }

    public draw(X: CanvasRenderingContext2D): void {
        X.save();
        if (!siteConfig.isMobile) {
            X.shadowColor = "rgba(0,0,0,0.35)";
            X.shadowBlur = 8;
            X.shadowOffsetX = 0;
            X.shadowOffsetY = 0;
        }
        X.globalCompositeOperation = "difference";

        X.drawImage(this.image, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        X.restore();
    }

    public shouldRedraw(): boolean {
        return (
            this.transitionProgress !== 0 && this.transitionProgress !== 1
        ) || super.shouldRedraw();
    }

    public tick(dt: number) {
        super.tick(dt);

        const imageRect = this.imageViewImage.getRect();
        if (imageRect && this.physics) {
            if (
                imageRect.x - this.rect.width < 0 ||
                imageRect.y - this.rect.height < 0
            ) {
                this.transitionProgress -= dt * ImageViewCloseButton.transitionSpeed;
                if (this.transitionProgress < 0) {
                    this.transitionProgress = 0;
                }
            } else {
                this.transitionProgress += dt * ImageViewCloseButton.transitionSpeed;
                if (this.transitionProgress > 1) {
                    this.transitionProgress = 1;
                }
            }

            const tx = imageRect.x - ImageViewCloseButton.width;
            const ty = imageRect.y - ImageViewCloseButton.height;
            const eased = easeInOutCubic(this.transitionProgress);
            this.physics.teleportTo(tx * eased, ty * eased);
        }
    }
}

export default ImageViewCloseButton;