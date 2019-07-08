import IV1Card from "../../../types/project/v1/IV1Card";

export default function getFirstDisplayImgSrc(card: IV1Card): string | undefined {
    const displays = card.content.display;

    for (const display of displays) {
        if (display.type === "img" && display.src) {
            return display.src;
        }
    }
}