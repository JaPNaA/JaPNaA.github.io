import { V2ProjectListing } from "../types/project/v2/V2Types";

export default function isV2ProjectListing(x: any): x is V2ProjectListing {
    return x && x.formatVersion === '2';
}