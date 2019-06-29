export default function addZeroWidthSpacesBetweenCamelCaseWords(str: string): string {
    return str.replace(/[a-zA-Z](?=[A-Z])/g, "$&\u200B");
}