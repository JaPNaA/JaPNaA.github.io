import "../../../../styles/views/CommandPalette.less";

import View from "../../../core/view/View";
import IApp from "../../../core/types/app/IApp";
import AppState from "../../../core/types/AppState";
import removeChildren from "../../../utils/removeChildren";
import CommandParser from "./CommandParser";
import CommandResult from "./CommandResult";

class CommandPalette extends View {
    public static viewName = "CommandPalette";
    public viewName = CommandPalette.viewName;

    protected elm: HTMLDivElement;

    private initValue?: string;

    private centerContainer: HTMLDivElement;
    private contentContainer: HTMLDivElement;
    private input: HTMLInputElement;
    private resultsContainer: HTMLDivElement;
    private backgroundClickCatcher: HTMLDivElement;

    private results: CommandResult[];
    private selectedResult: CommandResult | undefined;
    private selectedResultIndex: number;

    private keyFnMap: { [x: number]: (e: KeyboardEvent) => void } = {
        27: () => this.app.views.close(this),
        38: () => this.selectPreviousResult(),
        40: () => this.selectNextResult(),
        13: () => this.activateSelectedResult(),
        9: e => this.tabSelectedResult(e)
    };

    constructor(app: IApp, state: AppState) {
        super(app, state);
        this.elm = document.createElement("div");
        this.initValue = state.stateData;

        this.centerContainer = this.createCenterContainer();
        this.contentContainer = this.createContentContainer();
        this.input = this.createInput(this.initValue);
        this.resultsContainer = this.createResultsContainer();
        this.backgroundClickCatcher = this.createBackgroundClickCatcher();

        this.results = [];
        this.selectedResultIndex = -1;
    }

    public setup() {
        super.setup();

        this.elm.appendChild(this.backgroundClickCatcher);

        this.contentContainer.appendChild(this.input);
        this.contentContainer.appendChild(this.resultsContainer);
        this.centerContainer.appendChild(this.contentContainer);
        this.elm.appendChild(this.centerContainer);

        this.addEventHandlers();

        if (this.initValue) {
            this.update();
        }
    }

    private addEventHandlers(): void {
        this.input.addEventListener("input", this.inputHandler.bind(this));

        this.events.onKeydown(this.keydownHandler.bind(this));

        this.backgroundClickCatcher.addEventListener("click", () => {
            this.app.views.close(this);
        });
    }

    private inputHandler(): void {
        this.update();
    }

    private keydownHandler(e: KeyboardEvent): void {
        const fn = this.keyFnMap[e.keyCode];
        if (fn) {
            fn(e);
            e.stopPropagation();
        } else {
            this.input.focus();
        }
    }

    private async update(): Promise<void> {
        const value = this.input.value;
        if (!value) { this.clearResults(); return; }

        const results = await CommandParser.parse(value);
        this.clearResults();

        for (const result of results) {
            this.addResult(result);
        }
    }

    private createInput(value?: string): HTMLInputElement {
        const input = document.createElement("input");
        input.classList.add("input");
        input.placeholder = "Enter ? for help";
        if (value) { input.value = value; }
        return input;
    }

    private createCenterContainer(): HTMLDivElement {
        const centerContainer = document.createElement("div");
        centerContainer.classList.add("centerContainer");
        centerContainer.classList.add("longTextContainer");
        return centerContainer;
    }

    private createContentContainer(): HTMLDivElement {
        const contentContainer = document.createElement("div");
        contentContainer.classList.add("contentContainer");
        return contentContainer;
    }

    private createResultsContainer(): HTMLDivElement {
        const resultsContainer = document.createElement("div");
        resultsContainer.classList.add("resultsContainer");
        return resultsContainer;
    }

    private createBackgroundClickCatcher(): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add("backgroundClickCatcher");
        return elm;
    }

    private addResult(result: CommandResult): void {
        const elm = this.createResult(result);

        this.resultsContainer.appendChild(elm);
        this.results.push(result);

        if (this.selectedResultIndex < 0) {
            this.selectResult(0);
        }
    }

    private createResult(result: CommandResult): HTMLDivElement {
        const elm = document.createElement("div");
        elm.classList.add("result");
        result.elm = elm;

        const label = document.createElement("div");
        label.classList.add("label");
        label.innerText = result.label;

        elm.appendChild(label);

        if (result.description) {
            const description = document.createElement("div");
            description.classList.add("description");
            elm.classList.add("hasDescription");
            description.innerText = result.description;

            elm.appendChild(description);
        }

        if (result.clickable) {
            elm.classList.add("clickable");
        }

        elm.addEventListener("mousemove", () => {
            this.selectResult(result);
        });

        elm.addEventListener("click", () => {
            result.activate(this.app);
        });

        return elm;
    }

    private clearResults(): void {
        removeChildren(this.resultsContainer);
        this.results.length = 0;
        this.selectResult(-1);
    }

    private selectNextResult(): void {
        this.selectResult((this.selectedResultIndex + 1) % this.results.length);
    }

    private selectPreviousResult(): void {
        let index = this.selectedResultIndex - 1;
        if (index < 0) { index = this.results.length - 1; }

        this.selectResult(index);
    }

    private selectResult(result: number | CommandResult): void {
        if (this.selectedResult && this.selectedResult.elm) {
            this.selectedResult.elm.classList.remove("selected");
        }

        if (typeof result === 'number') {
            this.selectedResult = this.results[result];
            this.selectedResultIndex = result;
        } else {
            this.selectedResult = result;
            this.selectedResultIndex = this.results.indexOf(result);
        }

        if (this.selectedResult && this.selectedResult.elm) {
            this.selectedResult.elm!.classList.add("selected");
            this.scrollTo(this.selectedResult.elm!);
        }
    }

    private activateSelectedResult(): void {
        if (!this.selectedResult) {
            this.app.views.close(this);
            return;
        }

        this.selectedResult.activate(this.app);
    }

    private tabSelectedResult(e: KeyboardEvent): void {
        if (!this.selectedResult) { return; }

        const newValue = this.selectedResult.onTab();
        e.preventDefault();

        if (newValue) {
            this.input.value = newValue;
            this.update();
        }
    }

    private scrollTo(elm: HTMLElement): void {
        const bbox = elm.getBoundingClientRect();
        const parentBBox = this.resultsContainer.getBoundingClientRect();
        const distBottom = bbox.bottom - parentBBox.bottom;
        const topDist = bbox.top - parentBBox.top;

        if (distBottom > 0) {
            this.resultsContainer.scrollBy(0, distBottom);
        } else if (topDist < 0) {
            this.resultsContainer.scrollBy(0, topDist);
        }
    }
}

export default CommandPalette;