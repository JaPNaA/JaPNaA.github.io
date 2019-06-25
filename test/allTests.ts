import { TestList } from "./testFramework";
import ParseAppStateURLTest from "./tests/ParseAppStateURLTest";
import ShortUrlTest from "./tests/ShortUrlTest";
import GetServerTimeTest from "./tests/GetServerTime";

export default function createAllTests() {
    return new TestList([
        new ParseAppStateURLTest(),
        new ShortUrlTest(),
        new GetServerTimeTest()
    ])
};