import { TestRunner } from "../testFramework";
import parseAppStateURL from "../../src/core/utils/parseAppStateURL";

export default class ParseAppStateURLTest extends TestRunner {
    protected stopAfterFailedAssert = false;

    constructor() { super("parseAppStateUrl"); }

    public runTests(): void {
        for (const host of [
            location.protocol + "//" + location.host + "/",
            "http://localhost:8080/",
            "https://gh.japnaa.dev/",
            "https://gh.japnaa.dev/not/at/root/"
        ]) {
            this.testUrlWithHost(host);
        }

        this.nextAssertTests = "no url";
        this.assertEquals(
            parseAppStateURL(""),
            undefined
        );
    }

    private testUrlWithHost(host: string): void {
        const hostMessage = " (" + host + ")";

        this.nextAssertTests = "simple url" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "test"),
            {
                viewPath: "test",
                stateData: undefined,
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "projectdirectory?Thingy_2019"),
            {
                viewPath: "projectdirectory",
                stateData: "Thingy_2019",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "projectdirectory?Thingy_2019#jeepsacar"),
            {
                viewPath: "projectdirectory",
                stateData: "Thingy_2019#jeepsacar",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata with slashes and hashes" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "frameview?https://gh.japnaa.dev/overview#jeepsacar"),
            {
                viewPath: "frameview",
                stateData: "https://gh.japnaa.dev/overview#jeepsacar",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url only hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "#jeepsacar"),
            {
                viewPath: "#jeepsacar",
                stateData: undefined,
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with viewname and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "overview#jeepsacar"),
            {
                viewPath: "overview",
                stateData: "#jeepsacar",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "root" + hostMessage;
        this.assertEquals(
            parseAppStateURL(host),
            undefined
        );
    }
}