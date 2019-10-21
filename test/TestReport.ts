import css from './testReport.less';

import { TestResult, Passable, Assertion } from "./testFramework";

class TestReport {
    private elm: HTMLDivElement;
    private result: TestResult;

    constructor(result: TestResult) {
        this.elm = document.createElement("div");
        this.result = result;

        this.elm.classList.add(css.TestReport);

        this.setup();
    }

    public appendTo(parent: HTMLElement): void {
        parent.appendChild(this.elm);
    }

    public setup(): void {
        this.elm.appendChild(this.createTestResultElm(this.result));
    }

    private createTestResultElm(result: TestResult): HTMLDivElement {
        const elm = this.createElmWithPassClass(result.passed);
        const name = this.createResultNameElm(result.testName);
        const message = this.createResultMessageElm(result.message);
        const children = this.createResultChildrenElm();

        elm.classList.add(css.testResult);

        for (const assertion of result.assertions) {
            children.appendChild(this.createElmForPassable(assertion));
        }

        elm.appendChild(name);
        elm.appendChild(message);
        elm.appendChild(children);
        return elm;
    }

    private createElmForPassable(assertion: Passable): HTMLDivElement {
        if (assertion instanceof TestResult) {
            return this.createTestResultElm(assertion);
        } else if (assertion instanceof Assertion) {
            return this.createAssertionElm(assertion);
        } else {
            return this.createGenericPassableElm(assertion);
        }
    }

    private createAssertionElm(assertion: Assertion): HTMLDivElement {
        const elm = this.createElmWithPassClass(assertion.passed);
        const message = this.createResultMessageElm(assertion.message);
        elm.appendChild(message);
        elm.classList.add(css.assertion);
        return elm;
    }

    private createGenericPassableElm(passable: Passable): HTMLDivElement {
        const elm = this.createElmWithPassClass(passable.passed);
        const message = this.createResultMessageElm(passable.message);
        elm.appendChild(message);
        elm.classList.add(css.passable);
        return elm;
    }


    private createResultNameElm(name: string): HTMLDivElement {
        const elm = document.createElement("div");
        elm.innerText = name;
        elm.classList.add(css.name);
        return elm;
    }

    private createResultMessageElm(message?: string): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add(css.message);
        if (message) {
            elm.innerText = message;
        } else {
            elm.classList.add(css.empty);
        }
        return elm;
    }

    private createResultChildrenElm(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add(css.children);
        return elm;
    }

    private createElmWithPassClass(passed: boolean): HTMLDivElement {
        const elm = document.createElement("div");
        if (passed) {
            elm.classList.add(css.passed);
        } else {
            elm.classList.add(css.failed);
        }
        return elm;
    }
}

export default TestReport;