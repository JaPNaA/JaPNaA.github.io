import fs from "fs";

export function stat(path: string): Promise<fs.Stats> {
    return new Promise<fs.Stats>(function(res, rej) {
        fs.stat(path, function(err, stats) {
            if (err) {
                rej(err);
            } else {
                res(stats);
            }
        });
    });
}