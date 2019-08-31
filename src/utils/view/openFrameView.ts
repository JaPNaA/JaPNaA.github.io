import ViewMap from "../../core/view/ViewMap";
import resolveUrl from "../resolveUrl";

export default async function openFrameView(href: string): Promise<void> {
    const url = resolveUrl("/frameview/" + encodeURIComponent(href));
    const newWindow = open(url, "_blank");

    if (!newWindow) {
        console.warn("Window could not be opened");
        location.assign(url);
        return;
    }

    newWindow.opener = null;
}

ViewMap.prefetch("FrameView");