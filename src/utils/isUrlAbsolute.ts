export default function isUrlAbsolute(uri: string): boolean {
    return /^(?:[a-z]+:)?\/\//.test(uri);
}