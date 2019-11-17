import css from "./HTMLView.less";

import Widget from "../../../core/widget/Widget";
import HTMLViewParser from "../../../components/htmlViewParser/htmlViewParser";
import IApp from "../../../core/types/app/IApp";
import IHTMLViewDocument from "../../../components/htmlViewParser/iHTMLViewDocument";
import HTMLViewParserOptions from "../../../components/htmlViewParser/types/htmlViewParserOptions";
import siteResources from "../../../core/siteResources";
import defaultHtmlViewParserOptions from "./defaultHtmlViewParserOptions";

class HTMLView extends Widget {
    protected elm: Element;
    public cssName = css.HTMLView;

    private url?: string;
    private source?: string;

    private doc?: IHTMLViewDocument;
    private parser: HTMLViewParser;

    constructor(app: IApp, options?: HTMLViewParserOptions) {
        super();
        if (options) {
            this.parser = new HTMLViewParser(app, options);
        } else {
            this.parser = new HTMLViewParser(app, defaultHtmlViewParserOptions);
        }
        this.elm = document.createElement("div");
    }

    public setUrl(url: string): void {
        this.url = url;
    }

    public setSource(source: string): void {
        this.source = source;
    }

    public async setup(): Promise<void> {
        super.setup();

        let prom;

        if (this.source) {
            prom = this.write(this.source);
        } else if (this.url) {
            prom = this.loadAndWriteWithURL(this.url);
        } else {
            throw new Error("A url or source was not given");
        }

        prom.catch(err => this.writeError(err));

        await prom;
    }

    public async destory(): Promise<void> {
        super.destory();
        if (this.doc) {
            await this.doc.destory();
        }
    }

    private async loadAndWriteWithURL(url: string): Promise<void> {
        const html = await siteResources.loadTextPromise(url);
        await this.write(html);
    }

    private async write(source: string): Promise<void> {
        this.doc = this.parser.parse(source);
        this.doc.appendTo(this.elm);
        await this.doc.ready();
    }

    private writeError(err: Error) {
        console.error(err);
        this.elm.classList.add(css.loadError);
        this.elm.appendChild(document.createTextNode("Failed to load. Reason: " + err.message));
    }
}

export default HTMLView;