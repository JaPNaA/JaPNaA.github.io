import createAllTests from "./allTests";
import TestReport from "./testReport";

const elm = document.getElementById("test") as HTMLDivElement;
elm.innerText = "Testing...";

const allTests = createAllTests();

try {
    allTests.run();
} catch (err) {
    console.error(err);
}

const result = allTests.getResult();
console.log(result);

elm.innerText = "";

const report = new TestReport(result);
report.appendTo(elm);