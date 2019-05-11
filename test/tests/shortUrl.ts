import { TestRunner } from "../testFramework";
import parseShortUrl from "../../src/components/url/parseShortUrl";
import SiteConfig from "../../src/siteConfig";
import SiteResources from "../../src/siteResources";
import TextResource from "../../src/components/resourceLoader/resources/text";

export default class ShortUrlTest extends TestRunner {
    protected stopAfterFailedAssert = false;
    private promises: Promise<void>[];

    constructor() {
        super("shortUrl");
        this.promises = [];
    }

    public setup(): void {
        const text = new TextResource(SiteResources.__debug_getHooks(), SiteConfig.path.redirectMap, true);
        text.text = "jeep, https://www.google.ca/search?q=jeep&tbm=isch\njeepsacar ,https://www.google.com/?q=jeep";
        text.loaded = true;

        SiteResources.__debug_setResource(
            SiteConfig.path.redirectMap, text
        );
    }

    public async runTests(): Promise<void> {
        const thingy_ = SiteConfig.path.repo.thingy_;

        this.testParseShortUrl("#_",
            "_1minesweeperAI",
            thingy_ + "2017/minesweeperAI"
        );

        this.testParseShortUrl("map (jeep)",
            "jeep",
            "https://www.google.ca/search?q=jeep&tbm=isch"
        );

        this.testParseShortUrl("map (jeepsacar), space trimming",
            "jeepsacar",
            "https://www.google.com/?q=jeep"
        );

        await Promise.all(this.promises);
    }

    private testParseShortUrl(name: string, input: string, expected: string): void {
        this.promises.push(parseShortUrl(input)
            .then(e => {
                this.nextAssertTests = name;
                this.assertEquals(e, expected)
            })
            .catch(e => {
                this.assertNotRunningThisLine("Failed to parse url \"" + input + '"');
            })
        );
    }
}