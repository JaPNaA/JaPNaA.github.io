import urlFromViewState from "../urlFromViewState";

export default async function openFrameView(href: string): Promise<void> {
    const url = urlFromViewState("FrameView", href);
    const newWindow = open(url, "_blank");

    if (!newWindow) {
        console.warn("Window could not be opened");
        location.assign(url);
        return;
    }

    newWindow.opener = null;
}