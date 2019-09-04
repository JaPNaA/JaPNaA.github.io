import fs from "fs";

function promisifyReadLike<T>(path: string, fn: (path: string, cb: (err: Error | null, data: T) => void) => void): Promise<T> {
    return new Promise<T>(function (res, rej) {
        fn(path, function (err, data) {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });
}

function promisifyWriteLike(path: string, data: string, fn: (path: string, data: string, cb: (err: Error | null) => void) => void): Promise<void> {
    return new Promise<void>(function (res, rej) {
        fn(path, data, function (err) {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    });
}

function promisifyCreateLike(path: string, fn: (path: string, cb: (err: Error | null) => void) => void): Promise<void> {
    return new Promise<void>(function (res, rej) {
        fn(path, function (err) {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    });
}

export function stat(path: string): Promise<fs.Stats> {
    return promisifyReadLike(path, fs.stat)
}

export function readFile(path: string): Promise<fs.BinaryData> {
    return promisifyReadLike(path, fs.readFile);
}

export function readdir(path: string): Promise<string[]> {
    return promisifyReadLike(path, fs.readdir);
}

export function writeFile(path: string, data: string): Promise<void> {
    return promisifyWriteLike(path, data, fs.writeFile);
}

export function mkdir(path: string): Promise<void> {
    return promisifyCreateLike(path, fs.mkdir);
}