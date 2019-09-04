import * as fsPromise from "./utils/fsPromise";
import * as path from "path";
import ContentParser from "./ContentParser";
import IIndex from "../../src/types/project/IIndex";

type IndexJSONEntry = [number, number, string];

class IndexJSON {
    public largetNo: number = -1;

    private static readonly outName = "index.json";

    private data: IIndex = {
        start: -1,
        end: -1,
        meta: {}
    };

    public addYearEntry(year: number, entry: IndexJSONEntry) {
        if (this.data.start === -1 || year < this.data.start) {
            this.data.start = year;
        }

        if (this.data.end === -1 || year > this.data.end) {
            this.data.end = year;
        }

        this.data.meta[year] = entry;

        if (entry[1] > this.largetNo) {
            this.largetNo = entry[1];
        }
    }

    public async writeOut(): Promise<void> {
        fsPromise.writeFile(
            path.join(ContentParser.outDirectory, IndexJSON.outName),
            JSON.stringify(this.data)
        );
    }
}

export default IndexJSON;