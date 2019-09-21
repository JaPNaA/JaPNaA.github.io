import { TestRunner } from "../testFramework";
import parseAppStateURL from "../../src/core/utils/parseAppStateURL";

export default class ParseAppStateURLTest extends TestRunner {
    protected stopAfterFailedAssert = false;

    constructor() { super("parseAppStateUrl"); }

    public runTests(): void {
        for (const host of [
            location.protocol + "//" + location.host + "/",
            "http://localhost:8080/",
            "https://japnaa.github.io/",
            "https://japnaa.github.io/not/at/root/"
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
                viewName: "test",
                stateData: undefined,
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "projectdirectory?Thingy_2019"),
            {
                viewName: "projectdirectory",
                stateData: "Thingy_2019",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "projectdirectory?Thingy_2019#jeepsacar"),
            {
                viewName: "projectdirectory",
                stateData: "Thingy_2019#jeepsacar",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata with slashes and hashes" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "frameview?https://japnaa.github.io/overview#jeepsacar"),
            {
                viewName: "frameview",
                stateData: "https://japnaa.github.io/overview#jeepsacar",
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url only hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "#jeepsacar"),
            {
                viewName: "#jeepsacar",
                stateData: undefined,
                directURL: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with viewname and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "overview#jeepsacar"),
            {
                viewName: "overview",
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