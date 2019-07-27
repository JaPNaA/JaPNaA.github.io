import paths from "./paths";
import fs from "fs";

const yearFilePattern = /^\d+\.json$/;
const IN_DIRS = [paths.v1Out, paths.v2Out];

let cached: string[] | null = null;

export function getAllYearFiles(): string[] {
    if (cached !== null) {
        return cached;
    }

    const files: string[] = [];

    for (const inDir of IN_DIRS) {
        let dirFiles;
        try { dirFiles = fs.readdirSync(inDir); }
        catch (err) { continue; }

        for (const dirFile of dirFiles) {
            if (yearFilePattern.test(dirFile)) {
                files.push(inDir + "/" + dirFile);
            }
        }
    }

    cached = files;

    return files;
}