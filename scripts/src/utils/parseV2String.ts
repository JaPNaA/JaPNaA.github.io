import { InputV2Header, V2ProjectBodyElement, V2Project } from "../../../src/types/project/v2/V2Types";
import marked from "marked";
import MapWithGetAndDelete from "../utils/MapWithGetAndDelete";

const projectSplitRegex = /(^|\n)#[^#].+\n/g;
const commaSplitUnlessInBracketsRegex = /\s*,\s*(?![^\(\)]*\))/g;
const headerStartRegex = /(^|\n)#.+\n*(<!)?---+/;
const headerEndRegex = /---+/;

const nameRegex = /^#(.+)\n/;

const headerLineMap: { [x: string]: (value: string, header: InputV2Header) => void } = {
    tags: (value, header) => header.tags = value.split(",").map(tag => tag.trim()),
    author: (value, header) => header.author = value.split(",").map(tag => tag.trim()),
    shortDesc: (value, header) => header.shortDescription = value,
    textColor: (value, header) => header.textColor = value,
    accent: (value, header) => header.accentColor = value,
    link: (value, header) => header.link = value,
    timestamp: (value: string, header: InputV2Header) => {
        let date: Date;
        if (/^\s*\d+\s*$/.test(value)) {
            date = new Date(parseInt(value));
        } else {
            date = new Date(value);
        }

        if (isNaN(date.getTime())) {
            throw new ParseError("Timestamp not valid: \n" + value + '\n');
        }

        header.timestamp = date.getTime();
    },
    backgroundCSS: (value: string, header: InputV2Header) => {
        const background = value.split(commaSplitUnlessInBracketsRegex);
        if (header.background) {
            for (const item in background) {
                header.background.push(item);
            }
        } else {
            header.background = background;
        }
    }
};

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

export function parseV2String(v2Str: string, defaultHeaders?: Partial<InputV2Header>): V2Project[] {
    const projectsStr = splitFileToProjects(v2Str);
    const projects: V2Project[] = [];

    for (const projectStr of projectsStr) {
        projects.push(parseProjectStr(projectStr, defaultHeaders));
    }

    return projects;
}

export class ParseError extends Error { };

function parseProjectStr(projectStr: string, defaultHeaders: Partial<InputV2Header> = {}): V2Project {
    const name = parseNameStr(projectStr);
    const { head, headEndIndex } = parseHeadStr(projectStr);
    const body = parseBodyStr(projectStr, headEndIndex, head.link);

    return {
        head: {
            name: name,
            link: head.link || defaultHeaders.link,
            no: -1, // the actual number to be assigned later
            author: head.author || defaultHeaders.author,
            background: head.background || defaultHeaders.background,
            shortDescription: head.shortDescription || defaultHeaders.shortDescription,
            tags: head.tags || defaultHeaders.tags,
            textColor: head.textColor || defaultHeaders.textColor,
            timestamp: head.timestamp, // head.timestamp always defined; default header has no effect
            accentColor: head.accentColor || defaultHeaders.accentColor
        },
        body: body
    };
}

function parseNameStr(fullStr: string): string {
    const match = fullStr.trimLeft().match(nameRegex);
    if (!match || !match[1]) { throw new ParseError("Missing name"); }
    return match[1]
        // remove backslash (unless backslash proceeds)
        .replaceAll(/\\(?!\\)/g, "")
        .trim();
}

function parseHeadStr(fullStr: string): { head: InputV2Header, headEndIndex: number } {
    const { headStr, headEndIndex } = getHeadStr(fullStr);
    const lines = headStr.split("\n");
    const header: InputV2Header = {} as InputV2Header;

    for (const line of lines) {
        if (!line) { continue; }
        parseHeaderLine(line, header);
    }

    if (!header.timestamp) { throw new ParseError("No timestamp provided"); }

    return { head: header, headEndIndex: headEndIndex };
}

function parseHeaderLine(line: string, header: InputV2Header): void {
    const colonIndex = line.indexOf(":");
    const key = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 1);

    const applier = headerLineMap[key];
    if (applier) {
        applier(value.trim(), header);
    } else {
        warn("No matching header applier for:\n" + line + '\n');
    }
}

function getHeadStr(fullStr: string): { headStr: string, headEndIndex: number } {
    const startToken = headerStartRegex.exec(fullStr);
    if (!startToken) { throw new ParseError("No head"); }
    const startTokenEndIndex = startToken.index + startToken[0].length;
    const endToken = headerEndRegex.exec(fullStr.slice(startTokenEndIndex));
    if (!endToken) { throw new ParseError("No head"); }

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

    if (!splits.length) { throw new ParseError("No headers found"); }

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
        throw new ParseError("Invalid tag " + tagName);
    }
}

function parseCustomTagImage(argsString: string): V2ProjectBodyElement {
    const args = parseArgs(argsString);

    const src = args.getAndDelete("src");
    if (!src || src === true) { throw new ParseError("Image without src"); }

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
    if (!projectLink) { throw new ParseError("No link to project"); }
    return {
        type: "view-project",
        href: projectLink
    };
}

function parseCustomTagViewSource(args: string, projectLink?: string): V2ProjectBodyElement {
    if (!projectLink) { throw new ParseError("No link to project"); }
    const repoMatcher = /\/?([^\/]+)/;
    const repoMatch = projectLink.match(repoMatcher);
    if (!repoMatch) { throw new ParseError("Don't know how to handle that link"); }
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
    if (!match) { throw new ParseError("Invalid arg"); }
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
