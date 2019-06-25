import SiteConfig from "../../SiteConfig";
import siteResources from "../../core/siteResources";
import ContentMan from "../contentMan/contentMan";

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

    return card.content.link;
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

    return SiteConfig.path.repo.thingy_ + (yearInt + 2016) + "/" + path;
}

async function redirectByMap(short: string): Promise<string> {
    const map = await getMap();
    const url = map.get(short);
    if (!url) {
        throw new Error("Invalid shortUrl");
    } else {
        return url;
    }
}

async function getMap(): Promise<Map<string, string>> {
    return parseMap(await loadMap());
}

async function loadMap(): Promise<string> {
    return new Promise<string>(function (res, rej) {
        siteResources.loadText(SiteConfig.path.redirectMap)
            .onLoad(e => {
                if (e.data) {
                    res(e.data);
                } else {
                    rej();
                }
            })
            .onError(e => rej(e));
    });
}

function parseMap(text: string): Map<string, string> {
    const map = new Map<string, string>();
    const lines = text.split("\n");

    for (const line of lines) {
        const commaIndex = line.indexOf(",");
        const key = line.slice(0, commaIndex).trim();
        const value = line.slice(commaIndex + 1).trim();
        map.set(key, value);
    }

    return map;
}