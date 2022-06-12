import IndexJSON from "./IndexJSON";
import V2Files from "./V2Files";
import SitemapJSON from "./SitemapJSON";

class ContentParser {
    public static readonly inDirectory = "./public/assets/content/src";

    public static readonly outDirectory = "./build/assets/content";
    public static readonly outExtension = ".json";

    private indexJSON: IndexJSON;
    private sitemapJSON: SitemapJSON;
    private v2Files: V2Files;

    constructor() {
        this.indexJSON = new IndexJSON();
        this.sitemapJSON = new SitemapJSON();
        this.v2Files = new V2Files(this.indexJSON, this.sitemapJSON);
    }

    public async parseAndWrite() {
        await this.v2Files.parse();

        await Promise.all([
            this.indexJSON.writeOut(),
            this.sitemapJSON.writeOut(),
            this.v2Files.writeOut()
        ]);
    }
}

export default ContentParser;