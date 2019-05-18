import { TestRunner } from "../testFramework";
import SiteConfig from "../../src/siteConfig";

export default class GetServerTimeTest extends TestRunner {
    public name = "getServerTime";

    public async runTests(): Promise<void> {
        const time = await SiteConfig.getServerTime();
        const diff = time.getTime() - Date.now();
        this.assertTrue(
            Math.abs(diff) < 30000,
            "Difference between server time and (assumed correct time) client time is less than 30 seconds"
        );
    }
}