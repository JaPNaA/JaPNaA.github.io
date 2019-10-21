import urlFromState from "../urlFromViewState";
import createAppState from "../../core/utils/createAppState";

export default async function openFrameView(href: string): Promise<void> {
    const url = urlFromState(createAppState("FrameView", href));
    const newWindow = open(url, "_blank");

    if (!newWindow) {
        console.warn("Window could not be opened");
        location.assign(url);
        return;
    }

    newWindow.opener = null;
}