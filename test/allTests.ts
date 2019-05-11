import { TestList } from "./testFramework";
import ParseAppStateURLTest from "./tests/parseAppStateURL";
import ShortUrlTest from "./tests/shortUrl";

export default function createAllTests() {
    return new TestList([
        new ParseAppStateURLTest(),
        new ShortUrlTest()
    ])
};