import { TestRunner } from "../testFramework";
import parseAppStateURL from "../../src/utils/parseAppStateURL";

export default class ParseAppStateURLTest extends TestRunner {
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
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "allthingies/Thingy_2019"),
            {
                viewName: "allthingies",
                stateData: "Thingy_2019",
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "allthingies/Thingy_2019#jeepsacar"),
            {
                viewName: "allthingies",
                stateData: "Thingy_2019#jeepsacar",
                id: undefined
            }
        );

        this.nextAssertTests = "url only hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "#jeepsacar"),
            {
                viewName: "#jeepsacar",
                stateData: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with viewname and hash" + hostMessage;
        this.assertIterableObjectEquals(
            parseAppStateURL(host + "overview#jeepsacar"),
            {
                viewName: "overview",
                stateData: "#jeepsacar",
                id: undefined
            }
        );
    }
}