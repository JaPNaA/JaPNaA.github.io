import createAllTests from "./allTests";
import TestReport from "./TestReport";

const elm = document.getElementById("test") as HTMLDivElement;
elm.innerText = "Testing...";

const allTests = createAllTests();

allTests.run()
    .then(generateReport)
    .catch(err => console.error(err));

function generateReport() {
    const result = allTests.getResult();
    console.log(result);

    elm.innerText = "";

    const report = new TestReport(result);
    report.appendTo(elm);
}