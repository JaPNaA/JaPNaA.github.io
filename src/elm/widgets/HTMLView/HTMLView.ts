import "../../../../styles/widgets/HTMLView.less";

import Widget from "../../../core/widget/Widget";
import WidgetMap from "../../../core/widget/WidgetMap";
import HTMLViewParser from "../../../components/htmlViewParser/htmlViewParser";
import IApp from "../../../core/types/app/IApp";
import IHTMLViewDocument from "../../../components/htmlViewParser/iHTMLViewDocument";
import HTMLViewParserOptions from "../../../components/htmlViewParser/types/htmlViewParserOptions";
import siteResources from "../../../core/siteResources";
import defaultHtmlViewParserOptions from "./defaultHtmlViewParserOptions";

class HTMLView extends Widget {
    protected elm: Element;
    public static widgetName: string = "HTMLView";
    public widgetName = HTMLView.widgetName;

    private doc?: IHTMLViewDocument;
    private parser: HTMLViewParser;
    private url: string;

    constructor(app: IApp, url: string, options?: HTMLViewParserOptions) {
        super();
        this.url = url;
        if (options) {
            this.parser = new HTMLViewParser(app, options);
        } else {
            this.parser = new HTMLViewParser(app, defaultHtmlViewParserOptions);
        }
        this.elm = document.createElement("div");
    }

    public async setup(): Promise<void> {
        super.setup();

        this.loadAndWrite()
            .catch(err => this.writeError(err));
    }

    public async destory(): Promise<void> {
        super.destory();
        if (this.doc) {
            await this.doc.destory();
        }
    }

    private async loadAndWrite(): Promise<void> {
        const html = await siteResources.loadTextPromise(this.url);
        this.doc = this.parser.parse(html);
        this.doc.appendTo(this.elm);
    }

    private writeError(err: Error) {
        console.error(err);
        this.elm.classList.add("loadError");
        this.elm.appendChild(document.createTextNode("Failed to load. Reason: " + err.message));
    }
}

WidgetMap.add(HTMLView);

export default HTMLView;