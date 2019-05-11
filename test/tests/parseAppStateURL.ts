import { TestRunner } from "../testFramework";
import parseAppStateURL from "../../src/utils/parseAppStateURL";

export default class ParseAppStateURLTest extends TestRunner {
    public runTests(): void {
        this.nextAssertTests = "simple url";
        this.assertIterableObjectEquals(
            parseAppStateURL("http://localhost:8080/test"),
            {
                viewName: "test",
                stateData: undefined,
                id: undefined
            }
        );

        this.nextAssertTests = "url with statedata";
        this.assertIterableObjectEquals(
            parseAppStateURL("http://localhost:8080/allthingies/Thingy_2019"),
            {
                viewName: "allthingies",
                stateData: "Thingy_2019",
                id: undefined
            }
        );
    }
}