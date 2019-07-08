import isProjectCard from "../../../src/utils/isProjectCard";
import IV1InfoJSON from "../../../src/types/project/v1/IV1InfoJSON";

export function getV1InfoJSONRange(obj: IV1InfoJSON): { max: number | null, min: number | null } {
    let max = null;
    let min = null;

    for (const item of obj.data) {
        if (!isProjectCard(item)) { continue; }

        if (max === null || item.no > max) {
            max = item.no;
        }
        if (min === null || item.no < min) {
            min = item.no;
        }
    }

    return { max, min };
}