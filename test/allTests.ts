import { TestList } from "./testFramework";
import ParseAppStateURLTest from "./tests/parseAppStateURL";
import ShortUrlTest from "./tests/shortUrl";
import GetServerTimeTest from "./tests/getServerTime";

export default function createAllTests() {
    return new TestList([
        new ParseAppStateURLTest(),
        new ShortUrlTest(),
        new GetServerTimeTest()
    ])
};