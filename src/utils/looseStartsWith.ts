/**
 * Loosely checks if a string starts with another string
 * @param start Check the string starts with
 * @param str The string to check with
 * @returns score - larger is worse, -1 means it doesn't match
 */
export default function looseStartsWith(start: string, str: string): number {
    const strLength = str.length;
    const startLower = start.toLowerCase();
    const strLower = str.toLowerCase();
    let currStrIndex = 0;
    let skipped = 0;

    outer: for (const char of startLower) {
        for (; currStrIndex < strLength;) {
            if (strLower[currStrIndex] === char) {
                currStrIndex++;
                continue outer;
            } else {
                skipped++;
                currStrIndex++;
            }
        }

        return -1;
    }

    return skipped;
}