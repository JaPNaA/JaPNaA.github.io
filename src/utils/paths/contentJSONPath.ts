import siteConfig from "../../SiteConfig";

export default function contentJSONPath(year: string | number): string {
    return siteConfig.path.content + year + ".json";
}