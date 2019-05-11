import allTests from "./allTests";

const elm = document.getElementById("test") as HTMLDivElement;
elm.appendChild(document.createTextNode("It works!"));

try {
    allTests.run();
} catch (err) {
    console.error(err);
}