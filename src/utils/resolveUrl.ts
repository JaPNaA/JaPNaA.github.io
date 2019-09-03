import isUrlAbsolute from "./isUrlAbsolute";
import siteConfig from "../SiteConfig";
import url from 'url';

export default function resolveUrl(urlStr: string): string {
    if (isUrlAbsolute(urlStr)) {
        return urlStr;
    } else {
        return url.resolve(siteConfig.path.base, urlStr);
    }
}