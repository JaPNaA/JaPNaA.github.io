import IApp from "../../core/types/app/IApp";
import IImageView from "../../elm/views/ImageView/IImageView";
import siteConfig from "../../SiteConfig";
import openNoopener from "../../core/utils/open/openNoopener";
import urlFromViewState from "../urlFromViewState";

export default async function openImageView(app: IApp, img: HTMLImageElement): Promise<void> {
    if (siteConfig.isIOS) {
        // fixes weird iOS performance bug - runs much smoother if accessed using url
        openNoopener(urlFromViewState("ImageView", img.src));
    } else if (siteConfig.isIE) {
        // IE + Canvas + Images = no
        openNoopener(img.src);
    } else {
        const imageView = await app.top().views.open("ImageView") as IImageView;
        const bbox = img.getBoundingClientRect();

        imageView.setInitalTransform(bbox.left, bbox.top, bbox.width / img.naturalWidth);
        imageView.setImageSrc(img.src);
        imageView.transitionIn();
    }
}