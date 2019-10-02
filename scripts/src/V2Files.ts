import * as fsPromise from "./utils/fsPromise";
import * as path from "path";
import ContentParser from "./ContentParser";
import IFiles from "./types/IFiles";
import IndexJSON from "./IndexJSON";
import parseV2String from "./utils/parseV2String";
import { V2Project, V2ProjectListing } from "../../src/types/project/v2/V2Types";

class V2Files implements IFiles {
    private static readonly dirId = "v2";
    private projectsList: V2Project[] = [];
    private yearProjectMap: Map<number, V2Project[]> = new Map();

    constructor(
        private index: IndexJSON
    ) { }

    public async parse(): Promise<void> {
        await this.readDirectory(path.join(ContentParser.inDirectory, V2Files.dirId));
        this.sortProjectsIntoYearProjectMap();
        this.sortProjects();
        this.addYearEntriesIntoIndex();
    }

    public async writeOut(): Promise<void> {
        const outDir = path.join(ContentParser.outDirectory, V2Files.dirId);
        const proms: Promise<void>[] = [];

        await fsPromise.stat(outDir)
            .catch(err => fsPromise.mkdir(outDir));

        for (const project of this.projectsList) {
            proms.push(this.writeOutProjectBody(project));
        }

        await Promise.all(proms);
        proms.length = 0;

        for (const [year, projects] of this.yearProjectMap) {
            const data: V2ProjectListing = {
                formatVersion: "2",
                data: projects
            };

            proms.push(fsPromise.writeFile(
                path.join(outDir, year + ContentParser.outExtension),
                JSON.stringify(data)
            ));
        }

        await Promise.all(proms);
    }

    private async writeOutProjectBody(project: V2Project) {
        if (!Array.isArray(project.body)) { return; }

        const date = this.formatDate(new Date(project.head.timestamp));
        const name = project.head.name.replace(/\W/g, '-').toLowerCase();
        const filename = date + "-" + name + ContentParser.outExtension;
        const relativePath = path.join(V2Files.dirId, filename);
        const absolutePath = path.join(ContentParser.outDirectory, relativePath);

        await fsPromise.writeFile(absolutePath, JSON.stringify(project.body));

        project.body = relativePath;
    }

    private async readDirectory(dirPath: string): Promise<void> {
        const files = await fsPromise.readdir(dirPath);
        const proms = [];

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            proms.push(fsPromise.stat(filePath).then(stats => {
                if (stats.isDirectory()) {
                    return this.readDirectory(filePath);
                } else {
                    return this.readFile(dirPath, file);
                }
            }));
        }

        await Promise.all(proms);
    }

    private async readFile(dir: string, filename: string): Promise<void> {
        const filePath = path.join(dir, filename);
        const file = (await fsPromise.readFile(filePath)).toString();

        const projects = parseV2String(file);

        for (const project of projects) {
            this.projectsList.push(project);
        }
    }

    private sortProjectsIntoYearProjectMap(): void {
        for (const project of this.projectsList) {
            const year = new Date(project.head.timestamp).getUTCFullYear();
            const existingArr = this.yearProjectMap.get(year);

            if (existingArr) {
                existingArr.push(project);
            } else {
                this.yearProjectMap.set(year, [project]);
            }
        }
    }

    private sortProjects(): void {
        for (const [year, projects] of this.yearProjectMap) {
            projects.sort((a, b) => a.head.timestamp - b.head.timestamp);
        }
    }

    private addYearEntriesIntoIndex(): void {
        const keys: number[] = [];
        for (const key of this.yearProjectMap.keys()) {
            keys.push(key);
        }

        keys.sort((a, b) => a - b);

        for (const year of keys) {
            const projects = this.yearProjectMap.get(year)!;
            let largestNo = this.index.largetNo;
            let start = largestNo + 1;

            for (const project of projects) {
                project.head.no = ++largestNo;
            }

            this.index.addYearEntry(year, [
                start, largestNo,
                path.join(V2Files.dirId, year + ContentParser.outExtension)
            ]);
        }
    }

    private formatDate(date: Date): string {
        return date.getUTCFullYear() + "-" +
            date.getUTCMonth().toString().padStart(2, '0') + "-" +
            date.getUTCDate().toString().padStart(2, '0');
    }
}

export default V2Files;