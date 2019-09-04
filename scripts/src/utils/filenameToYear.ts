export default function filenameToYear(filename: string): number | undefined {
    const number = parseInt(filename.slice(0, filename.indexOf(".")));
    if (isNaN(number)) {
        return undefined;
    } else {
        return number;
    }
}