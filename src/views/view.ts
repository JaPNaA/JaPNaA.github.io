abstract class View {
    protected abstract elm: HTMLElement;
    protected sceneName?: string;

    public setup(): void {
        this.elm.classList.add("scene");
        this.elm.classList.add(this.sceneName || this.constructor.name);
    }

    /**
     * Opposite of setup.
     * @returns a promise that resolves when the scene's
     * destruction animation finishes, signifying that 
     * it's safe to remove the element.
     */
    public async destory(): Promise<void> {
        //
    }

    /** Appends scene element to element */
    public appendTo(elm: HTMLElement) {
        elm.appendChild(this.elm);
    }

    /** Removes scene element from element */
    public removeFrom(elm: HTMLElement) {
        elm.removeChild(this.elm);
    }
}

export default View;