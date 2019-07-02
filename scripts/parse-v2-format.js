const fs = require("fs");

const file = fs.readFileSync("./docs/assets/content/test.md").toString();
console.log(file);