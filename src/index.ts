import "./elm/views/loader";
import "./elm/widgets/loader";

import App from "./app/app";
import SiteConfig from "./siteConfig";

SiteConfig.setup();

const app = new App();
app.setup();

console.log(app);