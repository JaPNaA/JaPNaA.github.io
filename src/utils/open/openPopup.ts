export default function openPopup(href: string, width?: number, height?: number, x?: number, y?: number): Window | null {
    const win = open(
        href,
        "_blank",
        "width=" + (width || innerWidth - 64) +
        ", height=" + (height || innerHeight - 64) +
        ", left=" + (x || screenLeft + 32) +
        ", top=" + (y || screenTop + 32)
    );

    // noopener
    if (win) { win.opener = null; }
    return win;
}