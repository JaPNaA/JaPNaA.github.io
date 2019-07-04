import fs from "fs";

function promisify<T>(path: string, fn: (path: string, cb: (err: Error | null, data: T) => void) => void): Promise<T> {
    return new Promise<T>(function (res, rej) {
        fn(path, function (err, data) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    })
}

export function stat(path: string): Promise<fs.Stats> {
    return promisify(path, fs.stat)
}

export function readFile(path: string): Promise<fs.BinaryData> {
    return promisify(path, fs.readFile);
}