import App from "./App";

// @ts-ignore
__webpack_public_path__ = location.href.slice(0, location.href.lastIndexOf("/")) + "/bundles/";

const app = new App();
app.setup();

console.log(app);