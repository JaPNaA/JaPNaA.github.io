import IndexJSON from "./IndexJSON";
import V1Files from "./V1Files";
import V2Files from "./V2Files";
import SitemapJSON from "./SitemapJSON";

class ContentParser {
    public static readonly inDirectory = "./public/assets/content/src";

    public static readonly outDirectory = "./build/assets/content";
    public static readonly outExtension = ".json";

    private indexJSON: IndexJSON;
    private sitemapJSON: SitemapJSON;
    private v1Files: V1Files;
    private v2Files: V2Files;

    constructor() {
        this.indexJSON = new IndexJSON();
        this.sitemapJSON = new SitemapJSON();
        this.v1Files = new V1Files(this.indexJSON, this.sitemapJSON);
        this.v2Files = new V2Files(this.indexJSON, this.sitemapJSON);
    }

    public async parseAndWrite() {
        await this.v1Files.parse();
        await this.v2Files.parse();

        await Promise.all([
            this.indexJSON.writeOut(),
            this.sitemapJSON.writeOut(),
            this.v1Files.writeOut(),
            this.v2Files.writeOut()
        ]);
    }
}

export default ContentParser;