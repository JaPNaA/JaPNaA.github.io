import isUrlAbsolute from "./isUrlAbsolute";
import siteConfig from "../SiteConfig";
import url from 'url';

export default function resolveUrl(urlStr: string, base?: string): string {
    if (isUrlAbsolute(urlStr)) {
        return urlStr;
    } else {
        return url.resolve(base || siteConfig.path.base, urlStr);
    }
}