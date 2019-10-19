import * as fs from "fs";
import * as fsPromise from "./utils/fsPromise";
import * as path from "path";
import ContentParser from "./ContentParser";
import IFiles from "./types/IFiles";
import IV1InfoJSON from "../../src/types/project/v1/IV1InfoJSON";
import IndexJSON from "./IndexJSON";
import filenameToYear from "./utils/filenameToYear";
import isProjectV1Card from "../../src/utils/isProjectCard";
import SitemapJSON from "./SitemapJSON";

class V1Files implements IFiles {
    private static readonly dirId = "v1";
    private readonly absoluteInDir = path.join(ContentParser.inDirectory, V1Files.dirId);
    private readonly absoluteOutDir = path.join(ContentParser.outDirectory, V1Files.dirId);

    private files: string[] = [];

    constructor(
        private index: IndexJSON,
        private sitemap: SitemapJSON
    ) { }

    public async parse() {
        const files = await fsPromise.readdir(this.absoluteInDir);
        const proms: Promise<void>[] = [];

        for (const filename of files) {
            proms.push(
                fsPromise.readFile(path.join(this.absoluteInDir, filename))
                    .then(buffer => this.parseFile(filename, buffer.toString()))
                    .catch(() => { })
            )
        }
    }

    public async writeOut() {
        const proms: Promise<void>[] = [];

        await fsPromise.stat(this.absoluteOutDir)
            .catch(err => fsPromise.mkdir(this.absoluteOutDir));

        for (const file of this.files) {
            const readStream = fs.createReadStream(path.join(this.absoluteInDir, file));
            const outStream = fs.createWriteStream(path.join(this.absoluteOutDir, file));

            readStream.pipe(outStream);

            proms.push(new Promise(function (res, rej) {
                readStream.on("close", function () {
                    res();
                });

                readStream.on("error", function (err) {
                    rej(err);
                });
            }));
        }

        await Promise.all(proms);
    }

    private parseFile(filename: string, str: string): void {
        const obj: IV1InfoJSON = JSON.parse(str);
        const { max, min } = this.getNoRange(obj);

        const year = filenameToYear(filename);

        if (year === undefined) {
            console.warn("Found unexpected file " + filename + "in V1Files folder (not year file)");
            return;
        }

        if (max === null || min === null) {
            console.error("No items in year file " + filename);
            return;
        }

        for (let i = 0, length = obj.data.length; i < length; i++) {
            const item = obj.data[i];

            if (isProjectV1Card(item)) {
                let date = item.timestamp ? new Date(item.timestamp) : undefined;

                this.sitemap.addProject({
                    year: year,
                    index: i,
                    date: date
                });
            }
        }

        this.files.push(filename);
        this.index.addYearEntry(year, [min, max, path.join(V1Files.dirId, filename)]);
    }

    private getNoRange(obj: IV1InfoJSON) {
        let max: number | null = null;
        let min: number | null = null;

        for (const item of obj.data) {
            if (!isProjectV1Card(item)) { continue; }

            if (max === null || item.no > max) {
                max = item.no;
            }
            if (min === null || item.no < min) {
                min = item.no;
            }
        }

        return { max, min };
    }
}

export default V1Files;