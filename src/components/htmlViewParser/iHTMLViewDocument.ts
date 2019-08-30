interface IHTMLViewDocument {
    appendTo(parent: Element): void;
    destory(): Promise<void>;
    ready(): Promise<void>;
}

export default IHTMLViewDocument;