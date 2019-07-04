import parseV2String from "./parseV2File";
import fs from "fs";
import * as fsp from "./fsPromise";
import { Project } from "./v2Types";

const v2ContentPath = "./docs/assets/content/src/v2";
const v2OutPath = "./docs/assets/content/v2";
const projects: Project[] = [];
let countTotal = 0;
let countDone = 0;

recursiveReadFiles(v2ContentPath);

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
    const sortingMap: Map<number, Project[]> = new Map();

    for (const project of projects) {
        const year = new Date(project.head.timestamp).getUTCFullYear();
        const arr = sortingMap.get(year);
        if (arr) {
            arr.push(project);
        } else {
            sortingMap.set(year, [project]);
        }
    }

    if (!fs.existsSync(v2OutPath)) {
        console.log("Creating " + v2OutPath);
        fs.mkdirSync(v2OutPath);
    }

    console.log("Writing out...");

    for (const [year, projects] of sortingMap) {
        projects.sort((a, b) => a.head.timestamp - b.head.timestamp);
        writeOutProject(year, projects);
    }
}

function writeOutProject(year: number, projects: Project[]) {
    console.log("Writing out year " + year);

    for (const project of projects) {
        if (Array.isArray(project.body)) {
            const name = writeOutProjectBody(project);
            project.body = name;
        }
    }

    fs.writeFile(v2OutPath + '/' + year + '.json', JSON.stringify({
        formatVersion: '2',
        data: projects
    }), function (err) {
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
function writeOutProjectBody(project: Project): string {
    const date = formatDate(new Date(project.head.timestamp));
    const name = project.head.name.replace(/\W/, '-').toLowerCase();
    const filename = date + "-" + name + '.json';

    fs.writeFile(
        v2OutPath + '/' + filename,
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