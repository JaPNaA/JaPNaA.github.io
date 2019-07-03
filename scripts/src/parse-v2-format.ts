import parseV2String from "./parseV2File";
import fs from "fs";
import * as fsp from "./fsPromise";
import { Project } from "./v2Types";

const v2ContentPath = "./docs/assets/content/src/v2";
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
        console.log("\nDone!");
        console.log(projects);
    }
}

// console.log(JSON.stringify(parseV2File("./docs/assets/content/test.md")));