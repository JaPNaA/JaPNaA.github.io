import ICard from "../../../types/project/card";

export default function getFirstDisplayImgSrc(card: ICard): string | undefined {
    const displays = card.content.display;

    for (const display of displays) {
        if (display.type === "img" && display.src) {
            return display.src;
        }
    }
}