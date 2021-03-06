import { InputV2Header, V2ProjectBodyElement, V2Project } from "../../../src/types/project/v2/V2Types";
import marked from "marked";
import MapWithGetAndDelete from "../utils/MapWithGetAndDelete";

const projectSplitRegex = /(^|\n)#[^#].+\n/g;
const commaSplitRegex = /\s*,\s*/g;
const commaSplitUnlessInBracketsRegex = /\s*,\s*(?![^\(\)]*\))/g;
const headerStartRegex = /(^|\n)#.+\n.*\n*---+/;
const headerEndRegex = /---+/;

const nameRegex = /^#(.+)\n/;
const linkRegex = /(^|\n)#.+\n(.*)\n/;

const headerLineMap: Map<string, (line: string, matchStr: string, header: InputV2Header) => void> = new Map([
    ["[", applyHeaderLineTags],
    [">", applyHeaderLineShortDescription],
    ["@", applyHeaderLineTimestamp],
    ["background ", applyHeaderLineBackground],
    ["color ", applyHeaderLineColor],
    ["accent ", applyHeaderLineAccent]
]);
const headerTagsRegex = /\[.+?\]/g;
const headerByTagRegex = /^by\s+/;

const customTagRegex = /<!([\w-]+)\s?(.*?)>/g;
const customTagMap: Map<string, (args: string, projectLink?: string) => V2ProjectBodyElement> = new Map([
    ["img", parseCustomTagImage],
    ["view-project", parseCustomTagViewProject],
    ["view-source", parseCustomTagViewSource]
]);

marked.setOptions({
    headerIds: false,
    gfm: true
});

export default function parseV2String(v2Str: string): V2Project[] {
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
            timestamp: head.timestamp,
            accentColor: head.accentColor
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
    const background = line.slice(matchStr.length).trim().split(commaSplitUnlessInBracketsRegex);
    if (header.background) {
        header.background = header.background.concat(background);
    } else {
        header.background = background;
    }
}

function applyHeaderLineColor(line: string, matchStr: string, header: InputV2Header): void {
    header.textColor = line.slice(matchStr.length).trim();
}

function applyHeaderLineAccent(line: string, matchStr: string, header: InputV2Header): void {
    header.accentColor = line.slice(matchStr.length).trim();
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

function parseCustomTagImage(argsString: string): V2ProjectBodyElement {
    const args = parseArgs(argsString);

    const src = args.getAndDelete("src");
    if (!src || src === true) { throw new Error("Image without src"); }

    let caption = args.getAndDelete("--");
    if (caption === true) {
        caption = undefined;
    }

    let pixels = Boolean(args.getAndDelete("pixels"));

    for (const [key, val] of args) {
        console.warn("Unknown arg key '" + key + "' for custom tag image");
    }

    return {
        type: "image",
        caption: caption,
        pixels: pixels || undefined,
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

function parseCustomTagViewSource(args: string, projectLink?: string): V2ProjectBodyElement {
    if (!projectLink) { throw new Error("No link to project"); }
    const repoMatcher = /\/?([^\/]+)/;
    const repoMatch = projectLink.match(repoMatcher);
    if (!repoMatch) { throw new Error("Don't know how to handle that link"); }
    const repo = repoMatch[1];
    const pathInRepo = projectLink.slice(repoMatch[0].length);

    if (pathInRepo) {
        return {
            type: "view-source",
            href: "https://github.com/JaPNaA/" + repo + "/tree/master" + pathInRepo
        };
    } else {
        return {
            type: "view-source",
            href: "https://github.com/JaPNaA/" + repo
        };
    }
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

function parseArgs(argsString: string): MapWithGetAndDelete<string, string | true> {
    const args = splitAtWhitespacesUnlessInQuotes(argsString);
    const argMap = new MapWithGetAndDelete<string, string | true>();

    for (const arg of args) {
        const parsed = parseArg(arg);
        argMap.set(parsed[0], parsed[1]);
    }

    return argMap;
}

function parseArg(arg: string): [string, string | true] {
    const argRegex = /^(.+?)(="(.+)"|=(.+)|"(.+)")?$/;
    const match = arg.match(argRegex);
    if (!match) { throw new Error("Invalid arg"); }
    return [match[1], match[3] || match[4] || match[5] || true];
}

function splitAtWhitespacesUnlessInQuotes(str: string): string[] {
    let currStr = "";
    let quote = undefined;
    let arr = [];

    for (const char of str) {
        if (/\s/.test(char) && quote === undefined) {
            arr.push(currStr);
            currStr = "";
            continue;
        } else if (char === '"' || char === "'") {
            if (quote === char) {
                quote = undefined;
            } else if (quote === undefined) {
                quote = char;
            }
        }

        currStr += char;
    }

    if (currStr) { arr.push(currStr); }

    return arr;
}

function warn(str: string) {
    console.warn("\nWARN: " + str);
}
