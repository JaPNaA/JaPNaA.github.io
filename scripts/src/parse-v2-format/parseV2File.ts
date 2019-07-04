import { InputV2Header, V2Project, V2ProjectBodyElement } from "../utils/v2Types";
import marked from "marked";

const projectSplitRegex = /(^|\n)#.+\n/g;
const commaSplitRegex = /\s*,\s*/g;
const headerStartRegex = /(^|\n)#.+\n.*\n*---+/;
const headerEndRegex = /---+/;

const nameRegex = /^#(.+)\n/;
const linkRegex = /(^|\n)#.+\n(.*)\n/;

const headerLineMap: Map<string, (line: string, matchStr: string, header: InputV2Header) => void> = new Map([
    ["[", applyHeaderLineTags],
    [">", applyHeaderLineShortDescription],
    ["@", applyHeaderLineTimestamp],
    ["background ", applyHeaderLineBackground],
    ["color ", applyHeaderLineColor]
]);
const headerTagsRegex = /\[.+?\]/g;
const headerByTagRegex = /^by\s+/;

const customTagRegex = /<!([\w-]+)\s?(.*?)>/g;
const customTagMap: Map<string, (args: string, projectLink?: string) => V2ProjectBodyElement> = new Map([
    ["img", parseCustomTagImage],
    ["view-project", parseCustomTagViewProject]
]);

marked.setOptions({
    headerIds: false,
    gfm: true
});

function parseV2String(v2Str: string): V2Project[] {
    const projectsStr = splitFileToProjects(v2Str);
    const projects: V2Project[] = [];

    for (const projectStr of projectsStr) {
        projects.push(parseProjectStr(projectStr));
    }

    return projects;
}

function parseProjectStr(projectStr: string): V2Project {
    const name = parseNameStr(projectStr);
    const link = parseLinkStr(projectStr);
    const { head, headEndIndex } = parseHeadStr(projectStr);
    const body = parseBodyStr(projectStr, headEndIndex, link);

    return {
        head: {
            name: name,
            link: link,
            no: -1, // the actual number to be assigned later
            author: head.author,
            background: head.background,
            shortDescription: head.shortDescription,
            tags: head.tags,
            textColor: head.textColor,
            timestamp: head.timestamp
        },
        body: body
    };
}

function parseNameStr(fullStr: string): string {
    const match = fullStr.trimLeft().match(nameRegex);
    if (!match || !match[1]) { throw new Error("Missing name"); }
    return match[1].trim();
}

function parseLinkStr(fullStr: string): string | undefined {
    const match = fullStr.trimLeft().match(linkRegex);
    if (!match || !match[2] || headerEndRegex.test(match[2])) {
        warn("No link for project");
        return;
    }
    return match[2];
}

function parseHeadStr(fullStr: string): { head: InputV2Header, headEndIndex: number } {
    const { headStr, headEndIndex } = getHeadStr(fullStr);
    const lines = headStr.split("\n");
    const header: InputV2Header = {} as InputV2Header;

    for (const line of lines) {
        if (!line) { continue; }
        parseHeaderLine(line, header);
    }

    if (!header.timestamp) { throw new Error("No timestamp provided"); }

    return { head: header, headEndIndex: headEndIndex };
}

function parseHeaderLine(line: string, header: InputV2Header): void {
    for (const [startStr, applier] of headerLineMap) {
        if (line.startsWith(startStr)) {
            applier(line, startStr, header);
            return;
        }
    }

    warn("No matching header applier for:\n" + line + '\n');
}

function applyHeaderLineBackground(line: string, matchStr: string, header: InputV2Header): void {
    const background = line.slice(matchStr.length).trim().split(commaSplitRegex);
    if (header.background) {
        header.background = header.background.concat(background);
    } else {
        header.background = background;
    }
}

function applyHeaderLineColor(line: string, matchStr: string, header: InputV2Header): void {
    header.textColor = line.slice(matchStr.length).trim();
}

function applyHeaderLineShortDescription(line: string, matchStr: string, header: InputV2Header): void {
    header.shortDescription = line.slice(matchStr.length).trim();
}

function applyHeaderLineTags(line: string, matchStr: string, header: InputV2Header): void {
    const brackets = line.match(headerTagsRegex);
    if (!brackets) {
        throw new Error("Syntax Error: No closing ]");
    }
    for (let i = 0; i < brackets.length; i++) {
        const tagsStr = brackets[i];
        const withoutBrackets = tagsStr.slice(1, tagsStr.length - 1).trim();
        if (headerByTagRegex.test(withoutBrackets)) {
            const author = withoutBrackets.slice(withoutBrackets.indexOf(' ')).trim().split(commaSplitRegex);
            if (header.author) {
                header.author = header.author.concat(author);
            } else {
                header.author = author;
            }
        } else {
            const tags = withoutBrackets.split(commaSplitRegex);
            if (header.tags) {
                header.tags = header.tags.concat(tags);
            } else {
                header.tags = tags;
            }
        }
    }
}

function applyHeaderLineTimestamp(line: string, matchStr: string, header: InputV2Header): void {
    const timestamp = parseInt(line.slice(matchStr.length).trim());
    if (isNaN(timestamp)) {
        throw new Error("Timestamp not a number: \n" + line + '\n');
    }

    header.timestamp = timestamp;
}


function getHeadStr(fullStr: string): { headStr: string, headEndIndex: number } {
    const startToken = headerStartRegex.exec(fullStr);
    if (!startToken) { throw new Error("No head"); }
    const startTokenEndIndex = startToken.index + startToken[0].length;
    const endToken = headerEndRegex.exec(fullStr.slice(startTokenEndIndex));
    if (!endToken) { throw new Error("No head"); }

    return {
        headStr: fullStr.substr(startTokenEndIndex, endToken.index),
        headEndIndex: startTokenEndIndex + endToken.index + endToken[0].length
    };
}

function splitFileToProjects(v2Str: string): string[] {
    const splits: number[] = [];
    const matches = getAllFullMatches(projectSplitRegex, v2Str);
    for (const match of matches) {
        splits.push(match.index);
    }

    if (!splits.length) { throw new Error("No headers found"); }

    const projectStrs: string[] = [];
    for (let i = 0; i < splits.length; i++) {
        projectStrs.push(v2Str.slice(splits[i], splits[i + 1]).trim());
    }

    return projectStrs;
}


function parseBodyStr(fullStr: string, headEndIndex: number, projectLink?: string): V2ProjectBodyElement[] {
    const bodyStr = fullStr.slice(headEndIndex).trim();
    return parseBodyMarkdown(parseAllCustomTags(bodyStr, projectLink));
}

function parseAllCustomTags(bodyStr: string, projectLink?: string): (string | V2ProjectBodyElement)[] {
    const matches = getAllFullMatches(customTagRegex, bodyStr);
    const arr: (string | V2ProjectBodyElement)[] = [];
    let lastIndex = 0;

    for (const match of matches) {
        arr.push(bodyStr.slice(lastIndex, match.index));
        arr.push(parseCustomTag(match, projectLink));
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex !== bodyStr.length) {
        arr.push(bodyStr.slice(lastIndex));
    }

    return arr;
}

function parseCustomTag(match: RegExpExecArray, projectLink?: string): V2ProjectBodyElement {
    const tagName = match[1];
    const args = match[2];
    const parser = customTagMap.get(tagName);
    if (parser) {
        return parser(args, projectLink);
    } else {
        throw new Error("Invalid tag " + tagName);
    }
}

function parseCustomTagImage(args: string): V2ProjectBodyElement {
    const srcRegex = /src=("([^"]+)"|([^\s]+))/;
    const captionRegex = /--"([^"]+)"/;

    const srcMatch = args.match(srcRegex);
    if (!srcMatch) { throw new Error("Image without src"); }
    const src = srcMatch[2] || srcMatch[1];

    const captionMatch = args.match(captionRegex);
    let caption: string | undefined;
    if (captionMatch) {
        caption = captionMatch[1];
    }

    return {
        type: "image",
        caption: caption,
        src: src
    };
}

function parseCustomTagViewProject(args: string, projectLink?: string): V2ProjectBodyElement {
    if (!projectLink) { throw new Error("No link to project"); }
    return {
        type: "view-project",
        href: projectLink
    };
}

function parseBodyMarkdown(arr: (V2ProjectBodyElement | string)[]): V2ProjectBodyElement[] {
    const finalArr: V2ProjectBodyElement[] = [];

    for (const item of arr) {
        if (typeof item === 'string') {
            const parsed = parseMarkdownString(item);
            if (parsed) {
                finalArr.push(parsed);
            }
        } else {
            finalArr.push(item);
        }
    }

    return finalArr;
}

function parseMarkdownString(str: string): V2ProjectBodyElement | null {
    const parsed = marked.parse(str);
    if (parsed) {
        return {
            type: "markdown",
            text: parsed
        };
    } else {
        return null;
    }
}

function getAllFullMatches(regex: RegExp, str: string): RegExpExecArray[] {
    const matches: RegExpExecArray[] = [];
    let match;

    while (match = regex.exec(str)) {
        matches.push(match);
    }

    return matches;
}

function warn(str: string) {
    console.warn("\nWARN: " + str);
}

export default parseV2String;