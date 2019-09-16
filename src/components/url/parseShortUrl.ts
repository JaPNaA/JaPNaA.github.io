import siteConfig from "../../SiteConfig";
import siteResources from "../../core/siteResources";
import ContentMan from "../contentMan/contentMan";
import isV2Project from "../../utils/v2Project/isV2Project";
import getShortURLRedirectMap from "./getRedirectMap";

export default async function parseShortUrl(short: string): Promise<string | undefined> {
    const firstChar = short[0];

    switch (firstChar) {
        case '#':
            return await projectByNumber(short);
        case '_':
            return projectByYearAndName(short);
        default:
            return await redirectByMap(short);
    }
}

async function projectByNumber(short: string): Promise<string> {
    const no = parseInt(short.slice(1)); // trim out "#";
    if (isNaN(no)) { throw new Error("Invalid number"); }

    const card = await ContentMan.getCardByNumber(no);
    if (!card) { throw new Error("Card doesn't exist"); }

    if (isV2Project(card)) {
        if (!card.head.link) { throw new Error("Card doesn't link to anything"); }
        return card.head.link;
    } else {
        return card.content.link;
    }
}

function projectByYearAndName(short: string): string {
    const hashContent = short.slice(1); // trim out "_"

    const yearMatches = hashContent.match(/^\d+/);
    if (!yearMatches) { throw new Error("No year specified"); }
    const year = yearMatches[0];
    const yearInt = parseInt(year) || 0;
    const path = hashContent.slice(year.length);

    if (isNaN(yearInt)) {
        throw new Error("Invalid year");
    }

    return siteConfig.path.repo.thingy_ + (yearInt + 2016) + "/" + path;
}

async function redirectByMap(short: string): Promise<string> {
    const map = await getShortURLRedirectMap();
    const url = map.get(short);
    if (!url) {
        throw new Error("Invalid shortUrl");
    } else {
        return url;
    }
}
