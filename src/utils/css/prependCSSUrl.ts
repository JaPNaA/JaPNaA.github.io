export default function prependCSSUrl(pre: string, property: string): string {
    if (!property.toLowerCase().startsWith("url(")) { return property; }
    const url = property.slice(4, -1);
    return "url(" + pre + url + ")";
}