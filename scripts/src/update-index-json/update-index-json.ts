import * as fsp from "../utils/fsPromise";
import fs from "fs";
import path from "path";
import IV1InfoJSON from "../../../src/types/project/v1/IV1InfoJSON"
import paths from "../utils/paths";
import { getAllYearFiles } from "../utils/getAllYearFiles";
import { getV1InfoJSONRange } from "../utils/getV1InfoJSONRange";
import { getV2ProjectListingRange } from "../utils/getV2ProjectListingRange";
import { V2ProjectListing } from "../../../src/types/project/v2/V2Types";
import isV2ProjectListing from "../../../src/utils/isV2ProjectListing";

let minYear: null | number = null;
let maxYear: null | number = null;

const metaDatas: string[] = [];

const yearFiles = getAllYearFiles();

const proms = [];
for (const file of yearFiles) {
    proms.push(readFile(file));
}

Promise.all(proms).then(writeIndexFile);

async function readFile(path: string): Promise<void> {
    const file = await fsp.readFile(path)
        .then(e => e.toString())
        .then(e => JSON.parse(e));

    const year = extractYearFromPath(path);

    if (minYear === null || year < minYear) { minYear = year; }
    if (maxYear === null || year > maxYear) { maxYear = year; }

    metaDatas.push(createMetadata(year, file, path));
}

function extractYearFromPath(filePath: string) {
    const match = path.basename(filePath).match(/\d+/);
    if (!match) { throw new Error("Invalid name " + filePath); }
    return parseInt(match[0]);
}

function createMetadata(year: number, obj: V2ProjectListing | IV1InfoJSON, filePath: string) {
    const relativePath = path.relative(paths.contentRoot, filePath);
    if (isV2ProjectListing(obj)) {
        return createMetadataV2(year, obj, relativePath);
    } else {
        return createMetadataV1(year, obj, relativePath);
    }
}

function createMetadataV2(year: number, obj: V2ProjectListing, path: string): string {
    const { max, min } = getV2ProjectListingRange(obj);
    return `"${year}":[${min},${max},"${path}"]`;
}

function createMetadataV1(year: number, obj: IV1InfoJSON, path: string): string {
    const { max, min } = getV1InfoJSONRange(obj);
    return `"${year}":[${min},${max},"${path}"]`;
}

function writeIndexFile(): void {
    fs.writeFileSync(
        paths.index,
        `{"start":${minYear},"end":${maxYear},"meta":{${metaDatas.sort().join(",")}}}`
    );
}