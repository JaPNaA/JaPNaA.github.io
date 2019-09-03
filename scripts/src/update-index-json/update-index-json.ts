import * as fsp from "../utils/fsPromise";
import fs from "fs";
import path from "path";
import IV1InfoJSON from "../../../src/types/project/v1/IV1InfoJSON"
import paths from "../utils/paths";
import { getAllYearFiles } from "../utils/getAllYearFiles";
import { getV1InfoJSONRange } from "../utils/getV1InfoJSONRange";
import { getV2ProjectListingRange } from "../utils/getV2ProjectListingRange";
import { V2ProjectListing } from "../../../src/types/project/v2/V2Types";
import isV2ProjectListing from "../../../src/utils/v2Project/isV2ProjectListing";

class IndexJSONUpdater {
    private minYear: null | number = null;
    private maxYear: null | number = null;

    private metaDatas: string[] = [];
    private yearFiles: string[];

    private proms: Promise<any>[] = [];

    constructor() {
        this.yearFiles = getAllYearFiles();
    }

    public update(): Promise<void> {
        for (const file of this.yearFiles) {
            this.proms.push(this.readFile(file));
        }

        return Promise.all(this.proms).then(this.writeIndexFile);
    }

    private async readFile(path: string): Promise<void> {
        const file = await fsp.readFile(path)
            .then(e => e.toString())
            .then(e => JSON.parse(e));

        const year = this.extractYearFromPath(path);

        if (this.minYear === null || year < this.minYear) { this.minYear = year; }
        if (this.maxYear === null || year > this.maxYear) { this.maxYear = year; }

        this.metaDatas.push(this.createMetadata(year, file, path));
    }

    private extractYearFromPath(filePath: string) {
        const match = path.basename(filePath).match(/\d+/);
        if (!match) { throw new Error("Invalid name " + filePath); }
        return parseInt(match[0]);
    }

    private createMetadata(year: number, obj: V2ProjectListing | IV1InfoJSON, filePath: string) {
        const relativePath = path.relative(paths.contentRoot, filePath);
        if (isV2ProjectListing(obj)) {
            return this.createMetadataV2(year, obj, relativePath);
        } else {
            return this.createMetadataV1(year, obj, relativePath);
        }
    }

    private createMetadataV2(year: number, obj: V2ProjectListing, path: string): string {
        const { max, min } = getV2ProjectListingRange(obj);
        return `"${year}":[${min},${max},"${path}"]`;
    }

    private createMetadataV1(year: number, obj: IV1InfoJSON, path: string): string {
        const { max, min } = getV1InfoJSONRange(obj);
        return `"${year}":[${min},${max},"${path}"]`;
    }

    private writeIndexFile(): Promise<void> {
        return new Promise((res, rej) => fs.writeFile(
            paths.index,
            `{"start":${this.minYear},"end":${this.maxYear},"meta":{${this.metaDatas.sort().join(",")}}}`,
            function (err) {
                if (err) {
                    rej();
                } else {
                    res();
                }
            }
        ));
    }
}

if (require.main === module) {
    new IndexJSONUpdater().update();
}

export default IndexJSONUpdater;