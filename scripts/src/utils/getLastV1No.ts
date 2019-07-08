import * as fsp from "./fsPromise";
import { getAllYearFiles } from "./getAllYearFiles";
import { V2ProjectListing } from "../../../src/types/project/v2/V2Types";
import isV2ProjectListing from "../../../src/utils/isV2ProjectListing";
import IV1InfoJSON from "../../../src/types/project/v1/IV1InfoJSON";
import { getV1InfoJSONRange } from "./getV1InfoJSONRange";

let cached: undefined | number = undefined;
let max: number = 0;

async function readFile(path: string) {
    const obj: V2ProjectListing | IV1InfoJSON = await fsp.readFile(path)
        .then(e => e.toString())
        .then(e => JSON.parse(e));

    if (!isV2ProjectListing(obj)) {
        const thisMax = getV1InfoJSONRange(obj).max;
        if (thisMax !== null && thisMax > max) {
            max = thisMax;
        }
    }
}

export default async function getLastV1No(): Promise<number> {
    if (cached !== undefined) {
        return cached;
    }

    const files = getAllYearFiles();
    const proms = [];

    for (const file of files) {
        proms.push(readFile(file));
    }

    await Promise.all(proms);

    cached = max;
    return max;
}
