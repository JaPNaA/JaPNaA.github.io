import { TestRunner } from "../testFramework";
import parseShortUrl from "../../src/components/url/parseShortUrl";
import SiteConfig from "../../src/siteConfig";
import SiteResources from "../../src/core/siteResources";
import TextResource from "../../src/core/components/resourceLoader/resources/text";

export default class ShortUrlTest extends TestRunner {
    protected stopAfterFailedAssert = false;
    private promises: Promise<void>[];

    constructor() {
        super("shortUrl");
        this.promises = [];
    }

    public setup(): void {
        const text = new TextResource(SiteResources.__debug_getHooks(), SiteConfig.path.redirectMap, true);
        text.data = `
        jeep, https://www.google.ca/search?q=jeep&tbm=isch
         jeepsacar   ,       https://www.google.com/?q=jeep
        `;
        text.loaded = true;

        SiteResources.__debug_setResource(
            SiteConfig.path.redirectMap, text
        );
    }

    public async runTests(): Promise<void> {
        const thingy_ = SiteConfig.path.repo.thingy_;

        this.testParseShortUrl(
            "_1minesweeperAI",
            thingy_ + "2017/minesweeperAI"
        );
        this.testParseShortUrl(
            "_10nonexistantproject",
            thingy_ + "2026/nonexistantproject"
        );

        this.testParseShortUrl(
            "jeep",
            "https://www.google.ca/search?q=jeep&tbm=isch",
        );

        this.testParseShortUrl(
            "jeepsacar",
            "https://www.google.com/?q=jeep",
            "Lots of extra spaces"
        );
        this.testParseShortUrlError("dfajsldasflk");

        this.testParseShortUrl(
            "#20",
            "https://gitlab.com/JaPNaA/japnaabotdiscord"
        );
        this.testParseShortUrl(
            "#0",
            "/Thingy_2016/MyFirstEverSite/"
        );
        this.testParseShortUrlError("##asdf");

        await Promise.all(this.promises);
    }

    private testParseShortUrl(input: string, expected: string, message?: string): void {
        this.promises.push(parseShortUrl(input)
            .then(e => {
                this.nextAssertTests = message || "#" + input;
                this.assertEquals(e, expected)
            })
            .catch(e => {
                this.assertNotRunningThisLine("Failed to parse url \"" + input + '"');
            })
        );
    }

    private testParseShortUrlError(input: string, message?: string): void {
        this.promises.push(parseShortUrl(input)
            .then(e => {
                this.assertNotRunningThisLine("Failed to parse url \"" + input + '"');
            })
            .catch(e => {
                this.nextAssertTests = input + " throws error";
                this.assertRunningThisLine();
            })
        );
    }
}