import isUrlAbsolute from "./isUrlAbsolute";
import siteConfig from "../SiteConfig";
import resolveUrlNode from "./resolveUrlNode";

export default function resolveUrl(urlStr: string, base?: string): string {
    if (isUrlAbsolute(urlStr)) {
        return urlStr;
    } else {
        return resolveUrlNode(base || siteConfig.path.base, urlStr);
    }
}