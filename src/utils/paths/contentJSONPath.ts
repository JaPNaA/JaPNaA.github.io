import SiteConfig from "../../SiteConfig";

export default function contentJSONPath(year: string | number): string {
    return SiteConfig.path.content + year + ".json";
}