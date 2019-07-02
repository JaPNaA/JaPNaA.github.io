import fs from "fs";
import V2Header, { Project } from "./v2Types";

const projectSplitRegex = /(^|\n)#.+\n/g;
const commaSplitRegex = /\s*,\s*/g;
const headerStartRegex = /(^|\n)#.+\n\s*---+/;
const headerEndRegex = /---+/;

const nameRegex = /^#(.+)\n/;

const headerLineMap: Map<RegExp, (line: string, header: V2Header) => void> = new Map([
    [/^\[/, applyHeaderLineTags],
    [/^>/, applyHeaderLineShortDescription],
    [/^@/, applyHeaderLineTimestamp],
    [/^background\s+/i, applyHeaderLineBackground],
    [/^color\s+/i, applyHeaderLineColor]
]);
const headerTagsRegex = /\[.+?\]/g;
const headerByTagRegex = /^by\s+/;

function parseV2File(): void {
    const v2Str = fs.readFileSync("./docs/assets/content/test.md").toString();
    const projectsStr = splitFileToProjects(v2Str);
    const projects: Project[] = [];

    for (const projectStr of projectsStr) {
        const project = parseProjectStr(projectStr);
        console.log(JSON.stringify(project));
    }
}

function parseProjectStr(projectStr: string): Project {
    const name = parseNameStr(projectStr);
    const head = parseHeadStr(projectStr);
    
    return {
        head: {
            name: name,
            author: head.author,
            background: head.background,
            shortDescription: head.shortDescription,
            tags: head.tags,
            textColor: head.textColor,
            timestamp: head.timestamp
        },
        body: []
    };
}

function parseNameStr(fullStr: string): string {
    const match = fullStr.trimLeft().match(nameRegex);
    if (!match || !match[1]) { throw new Error("Missing name"); }
    return match[1].trim();
}

function parseHeadStr(fullStr: string): V2Header {
    const headStr = getHeadStr(fullStr);
    if (!headStr) { return {}; }
    const lines = headStr.split("\n");
    const header: V2Header = {};

    for (const line of lines) {
        parseHeaderLine(line, header);
    }

    return header;
}

function parseHeaderLine(line: string, header: V2Header): void {
    for (const [regex, applier] of headerLineMap) {
        if (regex.test(line)) {
            applier(line, header);
        }
    }
}

function applyHeaderLineBackground(line: string, header: V2Header): void {
    const background = line.slice(line.indexOf(" ")).trim().split(commaSplitRegex);
    if (header.background) {
        header.background = header.background.concat(background);
    } else {
        header.background = background;
    }
}

function applyHeaderLineColor(line: string, header: V2Header): void {
    header.textColor = line.slice(line.indexOf(" ")).trim();
}

function applyHeaderLineShortDescription(line: string, header: V2Header): void {
    header.shortDescription = line.slice(1).trim();
}

function applyHeaderLineTags(line: string, header: V2Header): void {
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

function applyHeaderLineTimestamp(line: string, header: V2Header): void {
    const timestamp = parseInt(line.slice(1).trim());
    if (isNaN(timestamp)) {
        throw new Error("Timestamp not a number: \n" + line + '\n');
    }

    header.timestamp = timestamp;
}


function getHeadStr(fullStr: string): string | null {
    const startToken = headerStartRegex.exec(fullStr);
    if (!startToken) { return null; }
    const startTokenEndIndex = startToken.index + startToken[0].length;
    const endToken = headerEndRegex.exec(fullStr.slice(startTokenEndIndex));
    if (!endToken) { return null; }

    return fullStr.substr(startTokenEndIndex, endToken.index);
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

function getAllFullMatches(regex: RegExp, str: string): RegExpExecArray[] {
    const matches: RegExpExecArray[] = [];
    let match;

    while (match = regex.exec(str)) {
        matches.push(match);
    }

    return matches;
}

console.log(parseV2File());