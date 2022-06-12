export default async function openInNewWindow(href: string): Promise<void> {
    const newWindow = open(href, "_blank");

    if (!newWindow) {
        console.warn("Window could not be opened");
        location.assign(href);
        return;
    }

    newWindow.opener = null;
}