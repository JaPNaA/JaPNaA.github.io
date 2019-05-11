export default function stringify(e: any): string {
    if (e === undefined) { return "undefined"; }
    if (e === null) { return "null"; }
    try {
        return JSON.stringify(e);
    } catch (err) {
        return e.toString();
    }
}