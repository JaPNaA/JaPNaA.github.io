import IInput from "./IInput";
import siteConfig from "../../../SiteConfig";
import Checkbox from "../Checkbox/Checkbox";
import EventHandlers from "../../../core/utils/events/EventHandlers";
import Handler from "../../../core/utils/events/Handler";

interface InputTree {
    [x: string]: any | InputTree;
}

// todo: refactor this

class SettingsEditor<T> {
    public changed: boolean;

    private static localStorageKey = siteConfig.localStorageSettingsKey;

    private elm: HTMLDivElement;
    private settings: T;
    private inputTree: InputTree;

    private inputValids: boolean[];

    private changeHandlers: EventHandlers;

    private parent?: Node;

    constructor(name: string, config: T) {
        this.changed = false;
        this.elm = document.createElement("div");
        this.elm.classList.add("settingsEditor");
        this.settings = config;
        this.inputValids = [];

        this.inputTree = {};

        this.changeHandlers = new EventHandlers();

        this.elm.appendChild(this.createConfigTree(name, this.settings, this.inputTree));
    }

    public appendTo(parent: Node): void {
        parent.appendChild(this.elm);
        this.parent = parent;
    }

    public saveConfigToLocalStorage(): void {
        localStorage[SettingsEditor.localStorageKey] = JSON.stringify(this.settings);
    }

    public restoreConfigFromLocalStorage(): void {
        const storedStr = localStorage[SettingsEditor.localStorageKey];
        let storedConfig;

        if (!storedStr) { return; }

        try {
            storedConfig = JSON.parse(storedStr);
        } catch (err) {
            console.warn("Error while parsing localstorage; value ignored", err);
        }

        this.restoreConfig(this.settings, storedConfig, this.inputTree);
    }

    public onChange(handler: Handler): void {
        this.changeHandlers.add(handler);
    }

    public offChange(handler: Handler): void {
        this.changeHandlers.remove(handler);
    }

    public remove(): void {
        if (!this.parent) { throw new Error("Was never appended"); }
        this.parent.removeChild(this.elm);
    }

    private restoreConfig(thisObj: any, otherObj: any, inputTree: InputTree): void {
        const keys = Object.keys(thisObj);

        for (const key of keys) {
            if (typeof thisObj[key] !== typeof otherObj[key]) { continue; }
            if (typeof otherObj[key] !== "object") {
                thisObj[key] = otherObj[key];
                if (typeof thisObj[key] === "boolean") {
                    (inputTree[key] as HTMLInputElement).checked = otherObj[key];
                } else {
                    (inputTree[key] as HTMLInputElement).value = otherObj[key];
                }
            } else {
                this.restoreConfig(thisObj[key], otherObj[key], inputTree[key] as InputTree);
            }
        }
    }

    private allInputsAreValid(): boolean {
        for (const valid of this.inputValids) {
            if (!valid) { return false; }
        }

        return true;
    }

    private createConfigTree(name: string, config: any, inputTree: InputTree, depth: number = 1): HTMLDivElement {
        const section = document.createElement("div");
        const heading = document.createElement("h2");
        const keys = Object.keys(config);

        section.classList.add("section");
        heading.classList.add("heading");
        heading.setAttribute("depth", depth.toString());
        heading.innerHTML = name;
        section.appendChild(heading);

        for (const key of keys) {
            const obj = config[key];

            switch (typeof obj) {
                case "number": {
                    const { elm, input } = this.createNumberInput(config, key, obj);
                    section.appendChild(elm)
                    inputTree[key] = input;
                    break;
                }
                case "string": {
                    const { elm, input } = this.createStringInput(config, key, obj);
                    section.appendChild(elm)
                    inputTree[key] = input;
                    break;
                }
                case "boolean": {
                    const { elm, input } = this.createBooleanInput(config, key, obj);
                    section.appendChild(elm)
                    inputTree[key] = input;
                    break;
                }
                case "object": {
                    const elmBranch = {} as any;
                    inputTree[key] = elmBranch;
                    section.appendChild(this.createConfigTree(
                        this.formatCamelCase(key),
                        obj, elmBranch, depth + 1
                    ));
                    break;
                }
            }
        }

        return section;
    }

    private createNumberInput(config: any, key: string, value: number): IInput {
        return this.createInput("number", config, value.toString(), key, value => {
            const parsed = parseInt(value);
            if (isNaN(parsed)) { return; }
            return parsed;
        });
    }

    private createStringInput(config: any, key: string, value: string): IInput {
        return this.createInput("text", config, value, key, value => value ? value : undefined);
    }

    private createBooleanInput(config: any, key: string, value: boolean): IInput {
        const elm = document.createElement("div");
        const label = document.createElement("label");
        const input = new Checkbox();
        elm.classList.add("configItem");
        elm.classList.add("checkbox");
        input.setup();
        input.setChecked(value);
        label.innerText = this.formatCamelCase(key);
        input.appendTo(elm);
        elm.appendChild(label);

        const changeHandler = (checked: boolean) => {
            this.changed = true;
            config[key] = checked;
            this.changeHandlers.dispatch();
        };

        label.addEventListener("click", () => {
            input.toggleChecked();
        });

        input.onChange(changeHandler);

        return { elm, input };
    }

    private createInput(type: string, config: any, value: string, key: string, parse: (value: string) => any | undefined): IInput {
        const elm = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const validIndex = this.inputValids.push(true);
        elm.classList.add("configItem");
        elm.classList.add(type);
        input.type = type;
        input.value = value;
        label.innerText = this.formatCamelCase(key);
        elm.appendChild(label);
        elm.appendChild(input);

        input.addEventListener("change", () => {
            elm.classList.remove("invalid");
            this.inputValids[validIndex] = true;
            this.changed = true;
            const parsed = parse(input.value);

            if (parsed === undefined) {
                elm.classList.add("invalid");
                this.inputValids[validIndex] = false;
            } else {
                config[key] = parsed;
                this.changeHandlers.dispatch();
            }
        });

        return { elm, input };
    }

    private formatCamelCase(str: string): string {
        const words = str.split(/(?=[a-zA-Z])(?=[A-Z])/g);
        const length = words.length;

        {
            const word = words[0];
            words[0] = word[0].toUpperCase() + word.slice(1);
        }

        for (let i = 1; i < length; i++) {
            const word = words[i];
            words[i] = word[0].toLowerCase() + word.slice(1);
        }

        return words.join(" ");
    }
}

export default SettingsEditor;