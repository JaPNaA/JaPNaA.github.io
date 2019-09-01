import App from "./App";
import "./polyfills/polyfills";

// @ts-ignore
__webpack_public_path__ = location.origin + location.pathname + "bundles/";

const app = new App();
app.setup();

console.log(app);