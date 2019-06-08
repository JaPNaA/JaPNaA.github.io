interface IHTMLViewDocument {
    appendTo(parent: Element): void;
    destory(): Promise<void>;
}

export default IHTMLViewDocument;