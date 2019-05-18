const fs = require("fs");
const PATH = "./docs/assets/content";
const OUT = PATH + "/index.json";

const files =
    fs.readdirSync(PATH)
        .filter(e => /^\d+\.json$/.test(e))
        .sort();

const startYear = extractYear(files[0]);
const endYear = extractYear(files[files.length - 1]);
const proms = [];
const metaDatas = [];

for (const file of files) {
    proms.push(asyncReadFile(PATH + "/" + file));
}

Promise.all(proms).then(writeIndexFile);

function asyncReadFile(path) {
    return new Promise((res, rej) => {
        fs.readFile(path, (err, data) => {
            if (err) { rej(); return; }
            metaDatas.push(createMetadataFrom(extractYear(path), JSON.parse(data.toString())));
            res();
        });
    });
}

function writeIndexFile() {
    fs.writeFileSync(
        OUT,
        `{"start":${startYear},"end":${endYear},"pattern":"[year].json","meta":{${metaDatas.sort().join(",")}}}`
    );
}

function extractYear(name) {
    return parseInt(name.match(/\d+/)[0]);
}

/**
 * @typedef {import("../src/types/project/infojson").default} IInfoJSON
 * @typedef {import("../src/types/project/card").default} ICard
 */
/**
 * @param {IInfoJSON} obj 
 */
function createMetadataFrom(year, obj) {
    const data = obj.data;
    let max = null;
    let min = null;

    for (const item_ of data) {
        if (item_.type !== "card") { continue; }

        /** @type {ICard} */
        // @ts-ignore
        const item = item_;

        if (max === null || item.no > max) {
            max = item.no;
        }
        if (min === null || item.no < min) {
            min = item.no;
        }
    }

    return `"${year}":[${min},${max}]`;
}