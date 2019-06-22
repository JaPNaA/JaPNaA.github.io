import Widget from "../../../core/widget/widget";
import WidgetMap from "../../../core/widget/widgetMap";
import HTMLViewParser from "../../../components/htmlViewParser/htmlViewParser";
import IApp from "../../../core/types/app/iApp";
import IHTMLViewDocument from "../../../components/htmlViewParser/iHTMLViewDocument";
import HTMLViewParserOptions from "../../../components/htmlViewParser/types/htmlViewParserOptions";
import SiteResources from "../../../core/siteResources";

class HTMLView extends Widget {
    protected elm: Element;
    public static widgetName: string = "HTMLView";
    public widgetName = HTMLView.widgetName;

    private document?: IHTMLViewDocument;
    private parser: HTMLViewParser;
    private url: string;

    constructor(app: IApp, url: string, options?: HTMLViewParserOptions) {
        super();
        this.url = url;
        this.parser = new HTMLViewParser(app, options);
        this.elm = document.createElement("div");
    }

    public async setup(): Promise<void> {
        super.setup();

        const html = await SiteResources.loadTextPromise(this.url);
        this.document = this.parser.parse(html);
        this.document.appendTo(this.elm);
    }

    public async destory(): Promise<void> {
        super.destory();
        if (this.document) {
            await this.document.destory();
        }
    }
}

WidgetMap.add(HTMLView);

export default HTMLView;