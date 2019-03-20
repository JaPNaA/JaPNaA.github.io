import Widget from "../widget";

class GlobalWidget extends Widget {
    protected elm: HTMLDivElement;

    constructor() {
        super();

        this.elm = document.createElement("div");
    }

    // public setup(): void {
    //     super.setup();
    // }
}

export default GlobalWidget;