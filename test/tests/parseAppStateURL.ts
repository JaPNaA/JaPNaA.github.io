import { TestRunner } from "../testFramework";
import parseAppStateURL from "../../src/utils/parseAppStateURL";

export default class ParseAppStateURLTest extends TestRunner {
    protected stopAfterFailedAssert = false;

    constructor() { super("parseAppStateUrl"); }

    public runTests(): void {
        for (const host of [
            location.protocol + "//" + location.host + "/",
            "http://localhost:8080/",
            "https://japnaa.github.io/"
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
                directURL: false,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "allthingies/Thingy_2019"),
            {
                viewName: "allthingies",
                stateData: "Thingy_2019",
                directURL: false,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "allthingies/Thingy_2019#jeepsacar"),
            {
                viewName: "allthingies",
                stateData: "Thingy_2019#jeepsacar",
                directURL: false,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata with slashes and hashes" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "frameview/https://japnaa.github.io/overview#jeepsacar"),
            {
                viewName: "frameview",
                stateData: "https://japnaa.github.io/overview#jeepsacar",
                directURL: false,
                id: undefined
            }
        );

        this.nextAssertTests = "url only hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "#jeepsacar"),
            {
                viewName: "#jeepsacar",
                stateData: undefined,
                directURL: false,
                id: undefined
            }
        );

        this.nextAssertTests = "url with viewname and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "overview#jeepsacar"),
            {
                viewName: "overview",
                stateData: "#jeepsacar",
                directURL: false,
                id: undefined
            }
        );
    }
}