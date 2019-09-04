import IndexJSON from "./IndexJSON";
import V1Files from "./V1Files";
import V2Files from "./V2Files";

class ContentParser {
    public static readonly inDirectory = "./public/assets/content/src";

    public static readonly outDirectory = "./build/assets/content";
    public static readonly outExtension = ".json";

    private indexJSON: IndexJSON;
    private v1Files: V1Files;
    private v2Files: V2Files;

    constructor() {
        this.indexJSON = new IndexJSON();
        this.v1Files = new V1Files(this.indexJSON);
        this.v2Files = new V2Files(this.indexJSON);
    }

    public async parseAndWrite() {
        await this.v1Files.parse();
        await this.v2Files.parse();

        await Promise.all([
            this.indexJSON.writeOut(),
            this.v1Files.writeOut(),
            this.v2Files.writeOut()
        ]);
    }
}

export default ContentParser;