const propertyMatcher = /^url\((.+)\)$/;

export default function getImageSrcFromCSSProperty(value: string): string | undefined {
    const match = value.match(propertyMatcher);
    if (match) {
        return match[1];
    }
}