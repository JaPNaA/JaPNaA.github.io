import { TestRunner } from "../testFramework";
import siteConfig from "../../src/SiteConfig";

export default class GetServerTimeTest extends TestRunner {
    public name = "getServerTime";

    public async runTests(): Promise<void> {
        const time = await siteConfig.getServerTime();
        const diff = time.getTime() - Date.now();
        this.assertTrue(
            Math.abs(diff) < 30000,
            "Difference between server time and (assumed correct time) client time is less than 30 seconds"
        );
    }
}