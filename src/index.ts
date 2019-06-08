import App from "./app";

// @ts-ignore
__webpack_public_path__ = location.href.slice(0, location.href.lastIndexOf("/") + 1);

const app = new App();
app.setup();

console.log(app);