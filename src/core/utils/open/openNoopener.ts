export default function openNoopener(href: string): Window | null {
    const win = open(href, "_blank");
    // noopener
    if (win) { win.opener = null; }
    return win;
}