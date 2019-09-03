import parseV2String from "./parseV2String";
import fs from "fs";
import * as fsp from "../utils/fsPromise";
import { V2Project, V2ProjectListing } from "../../../src/types/project/v2/V2Types";
import paths from "../utils/paths";
import getLastV1No from "../utils/getLastV1No";
import path from 'path';

class V2FormatParser {
    private projects: V2Project[] = [];
    private countTotal: number = 0;
    private countDone: number = 0;

    private no: number = 0;
    private noPromise: Promise<number>;

    private finishPromise: Promise<void>;
    private finishPromiseRes?: () => void;
    private finishPromiseRej?: () => void;

    constructor() {
        this.noPromise = getLastV1No()
            .then(no => this.no = no)
            .catch(() => this.no = 0);

        this.finishPromise = new Promise((res, rej) => {
            this.finishPromiseRes = res;
            this.finishPromiseRej = rej;
        });
    }

    public async parse() {
        this.recursiveReadFiles(paths.v2Content);
        return this.finishPromise;
    }

    private recursiveReadFiles(path: string): void {
        const files = fs.readdirSync(path);
        for (const file of files) {
            const currPath = path + '/' + file;
            this.addCountTotal();
            fsp.stat(currPath).then(
                stats => {
                    this.recursiveReadFile(stats, currPath);
                    this.addCountDone();
                }
            );
        }
    }

    private recursiveReadFile(stats: fs.Stats, path: string): void {
        if (stats.isDirectory()) {
            this.recursiveReadFiles(path);
        } else {
            this.parseAndAddToProjects(path);
        }
    }

    private parseAndAddToProjects(path: string): void {
        this.addCountTotal();
        fs.readFile(path, (err, data) => {
            if (err) {
                console.warn("Failed reading file " + path);
                return;
            }

            try {
                const proj = parseV2String(data.toString());
                this.projects.push(...proj);
            } catch (err) {
                console.error(err);
            }

            this.addCountDone();
        });
    }

    private addCountDone() {
        this.countDone++;
        this.updateCount();
    }

    private addCountTotal() {
        this.countTotal++;
        this.updateCount();
    }

    private updateCount() {
        process.stdout.write('\r' + this.countDone + " of " + this.countTotal + " jobs done...");
        if (this.countDone >= this.countTotal) {
            console.log("\nDone reading!");
            this.writeOut()
                .then(() => {
                    if (this.finishPromiseRes) {
                        this.finishPromiseRes()
                    } else {
                        throw new Error("Finish promise resolve is undefined");
                    }
                });
        }
    }

    private async writeOut(): Promise<void> {
        const sortingMap: Map<number, V2Project[]> = new Map();

        for (const project of this.projects) {
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
        const proms: Promise<void>[] = [];

        await this.noPromise;

        for (const year of years) {
            const projects = sortingMap.get(year)!;
            projects.sort((a, b) => a.head.timestamp - b.head.timestamp);
            proms.push(this.writeOutProject(year, projects));
        }

        await Promise.all(proms);
    }

    private async writeOutProject(year: number, projects: V2Project[]): Promise<void> {
        console.log("Writing out year " + year);

        for (const project of projects) {
            if (Array.isArray(project.body)) {
                const name = this.writeOutProjectBody(project);
                project.body = name;
            }
            project.head.no = ++this.no;
        }

        const projectListing: V2ProjectListing = {
            formatVersion: '2',
            data: projects
        };

        return new Promise(function (res, rej) {
            fs.writeFile(paths.v2Out + '/' + year + '.json', JSON.stringify(projectListing), function (err) {
                if (err) {
                    rej(err);
                    console.error("Failed writing out year " + year, err);
                } else {
                    res();
                }
            });
        });
    }

    /**
     * Writes the project body to a file
     * @param project project
     * @returns path to the file
     */
    private writeOutProjectBody(project: V2Project): string {
        const date = this.formatDate(new Date(project.head.timestamp));
        const name = project.head.name.replace(/\W/g, '-').toLowerCase();
        const filename = date + "-" + name + '.json';
        const finalPath = paths.v2Out + '/' + filename;

        fs.writeFile(
            finalPath,
            JSON.stringify(project.body),
            function (err) {
                if (err) {
                    console.error("Failed writing out project body " + filename, err);
                }
            }
        );

        console.log("Writing out project body " + filename);

        return path.relative(paths.contentRoot, finalPath);
    }

    private formatDate(date: Date): string {
        return date.getUTCFullYear() + "-" +
            date.getUTCMonth().toString().padStart(2, '0') + "-" +
            date.getUTCDate().toString().padStart(2, '0');
    }
}

export default V2FormatParser;