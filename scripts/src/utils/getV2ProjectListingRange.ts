import { V2ProjectListing } from "./v2Types";

export function getV2ProjectListingRange(obj: V2ProjectListing): { max: number | null, min: number | null } {
    let max = null;
    let min = null;

    for (const item of obj.data) {

        if (max === null || item.head.no > max) {
            max = item.head.no;
        }
        if (min === null || item.head.no < min) {
            min = item.head.no;
        }
    }

    return { max, min };
}