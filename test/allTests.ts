import { TestList } from "./testFramework";
import ParseAppStateURLTest from "./tests/parseAppStateURL";

export default function createAllTests() {
    return new TestList([
        new ParseAppStateURLTest()
    ])
};