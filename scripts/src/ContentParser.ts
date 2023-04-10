import IndexJSON from "./IndexJSON";
import V2Files from "./V2Files";
import SitemapJSON from "./SitemapJSON";
import { ThingyProjectReadmeFinder } from "./ThingyReadmeFinder";

class ContentParser {
    public static readonly inDirectory = "./public/assets/content/src";
    public static readonly thingyDirectory = "../../";

    public static readonly outDirectory = "./build/assets/content";
    public static readonly outExtension = ".json";

    private indexJSON: IndexJSON;
    private sitemapJSON: SitemapJSON;
    private thingyProjectReadmeFinder: ThingyProjectReadmeFinder;
    private v2Files: V2Files;

    constructor() {
        this.indexJSON = new IndexJSON();
        this.sitemapJSON = new SitemapJSON();
        this.thingyProjectReadmeFinder = new ThingyProjectReadmeFinder();
        this.v2Files = new V2Files(this.indexJSON, this.sitemapJSON);
    }

    public async parseAndWrite() {
        const externalProjects = await this.thingyProjectReadmeFinder.readThingyDirectories();
        this.v2Files.addExternalProjects(externalProjects);
        await this.v2Files.parse();

        await Promise.all([
            this.indexJSON.writeOut(),
            this.sitemapJSON.writeOut(),
            this.v2Files.writeOut()
        ]);
    }
}

export default ContentParser;