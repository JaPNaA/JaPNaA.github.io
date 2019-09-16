import siteConfig from "../../SiteConfig";
import siteResources from "../../core/siteResources";

let cached: Map<string, string> | undefined;

export default async function getShortURLRedirectMap(): Promise<Map<string, string>> {
    if (cached) {
        return cached;
    } else {
        cached = parseMap(await loadMap());
        return cached;
    }
}

async function loadMap(): Promise<string> {
    return new Promise<string>(function (res, rej) {
        siteResources.loadText(siteConfig.path.redirectMap)
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