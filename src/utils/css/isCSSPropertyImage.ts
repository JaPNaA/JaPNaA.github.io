/**
 * Matches any function call with gradient or url in the name
 */
const matcher = /^.*(gradient|url).*\(.+?\)$/i;

export default function isCSSPropertyImage(property: string): boolean {
    return matcher.test(property);
}