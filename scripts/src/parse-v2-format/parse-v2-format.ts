import parseV2String from "./parseV2File";
import fs from "fs";
import * as fsp from "../utils/fsPromise";
import { V2Project, V2ProjectListing } from "../utils/v2Types";
import paths from "../utils/paths";
import getLastV1No from "../utils/getLastV1No";

const projects: V2Project[] = [];
let countTotal = 0;
let countDone = 0;

let no = 0;
let noPromise = getLastV1No().then(e => no = e);;

recursiveReadFiles(paths.v2Content);

function recursiveReadFiles(path: string): void {
    const files = fs.readdirSync(path);
    for (const file of files) {
        const currPath = path + '/' + file;
        addCountTotal();
        fsp.stat(currPath).then(
            stats => {
                recursiveReadFile(stats, currPath);
                addCountDone();
            }
        );
    }
}

function recursiveReadFile(stats: fs.Stats, path: string): void {
    if (stats.isDirectory()) {
        recursiveReadFiles(path);
    } else {
        parseAndAddToProjects(path);
    }
}

function parseAndAddToProjects(path: string): void {
    addCountTotal();
    fs.readFile(path, function (err, data) {
        if (err) {
            console.warn("Failed reading file " + path);
            return;
        }

        try {
            const proj = parseV2String(data.toString());
            projects.push(...proj);
        } catch (err) {
            console.error(err);
        }

        addCountDone();
    });
}

function addCountDone() {
    countDone++;
    updateCount();
}

function addCountTotal() {
    countTotal++;
    updateCount();
}

function updateCount() {
    process.stdout.write('\r' + countDone + " of " + countTotal + " jobs done...");
    if (countDone >= countTotal) {
        console.log("\nDone reading!");
        writeOut();
    }
}

function writeOut(): void {
    const sortingMap: Map<number, V2Project[]> = new Map();

    for (const project of projects) {
        const year = new Date(project.head.timestamp).getUTCFullYear();
        const arr = sortingMap.get(year);
        if (arr) {
            arr.push(project);
        } else {
            sortingMap.set(year, [project]);
        }
    }

    if (!fs.existsSync(paths.v2Out)) {
        console.log("Creating " + paths.v2Out);
        fs.mkdirSync(paths.v2Out);
    }

    console.log("Writing out...");

    const years = Array.from(sortingMap.keys()).sort((a, b) => a - b);

    for (const year of years) {
        const projects = sortingMap.get(year)!;
        projects.sort((a, b) => a.head.timestamp - b.head.timestamp);
        writeOutProject(year, projects);
    }
}

async function writeOutProject(year: number, projects: V2Project[]) {
    console.log("Writing out year " + year);

    await noPromise;

    for (const project of projects) {
        if (Array.isArray(project.body)) {
            const name = writeOutProjectBody(project);
            project.body = name;
        }
        project.head.no = ++no;
    }

    const projectListing: V2ProjectListing = {
        formatVersion: '2',
        data: projects
    };

    fs.writeFile(paths.v2Out + '/' + year + '.json', JSON.stringify(projectListing), function (err) {
        if (err) {
            console.error("Failed writing out year " + year, err);
        }
    });
}

/**
 * Writes the project body to a file
 * @param project project
 * @returns path to the file
 */
function writeOutProjectBody(project: V2Project): string {
    const date = formatDate(new Date(project.head.timestamp));
    const name = project.head.name.replace(/\W/, '-').toLowerCase();
    const filename = date + "-" + name + '.json';

    fs.writeFile(
        paths.v2Out + '/' + filename,
        JSON.stringify(project.body),
        function (err) {
            if (err) {
                console.error("Failed writing out project body " + filename, err);
            }
        }
    );

    console.log("Writing out project body " + filename);

    return filename;
}

function formatDate(date: Date): string {
    return date.getUTCFullYear() + "-" +
        date.getUTCMonth().toString().padStart(2, '0') + "-" +
        date.getUTCDate().toString().padStart(2, '0');
}