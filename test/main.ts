import createAllTests from "./allTests";
import TestReport from "./testReport";

const elm = document.getElementById("test") as HTMLDivElement;
elm.appendChild(document.createTextNode("Testing..."));

const allTests = createAllTests();

try {
    allTests.run();
} catch (err) {
    console.error(err);
}

const result = allTests.getResult();
console.log(result);

const report = new TestReport(result);
report.appendTo(elm);