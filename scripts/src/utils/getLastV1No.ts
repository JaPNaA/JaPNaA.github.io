import * as fsp from "./fsPromise";
import paths from "./paths";
import { getAllYearFiles } from "./getAllYearFiles";
import { V2ProjectListing, isV2ProjectListing } from "./v2Types";
import IInfoJSON from "../../../src/types/project/IInfoJSON";
import { getV1InfoJSONRange } from "./getV1InfoJSONRange";

let cached: undefined | number = undefined;
let max: number = 0;

async function readFile(path: string) {
    const obj: V2ProjectListing | IInfoJSON = await fsp.readFile(path)
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
