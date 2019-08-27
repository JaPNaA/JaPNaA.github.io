import { V2ProjectListing } from "../../types/project/v2/V2Types";
import IV1InfoJSON from "../../types/project/v1/IV1InfoJSON";

export default function isV2ProjectListing(x: V2ProjectListing | IV1InfoJSON): x is V2ProjectListing {
    // @ts-ignore
    return x && x.formatVersion === '2';
}