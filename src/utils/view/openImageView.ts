import IApp from "../../core/types/app/IApp";
import IImageView from "../../elm/views/ImageView/IImageView";

export default async function openImageView(app: IApp, img: HTMLImageElement): Promise<void> {
    const imageView = await app.top().views.open("ImageView") as IImageView;
    const bbox = img.getBoundingClientRect();

    imageView.setInitalTransform(bbox.left, bbox.top, bbox.width / img.naturalWidth);
    imageView.setImageSrc(img.src);
    imageView.transitionIn();
}