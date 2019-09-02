import { easeOutExp } from "../../../utils/easingFunctions";
import ViewComponent from "../../../core/view/ViewComponent";
import ISavableScroll from "./ISaveScrollable";

// todo: if the user scrolls, don't scroll after load

class SaveScroll extends ViewComponent {
    private static readonly scrollTransitionSpeed = 800;

    private privateData: { scrollTop: number };
    private initalScrollTop: number;
    private elm: Element;

    constructor(target: ISavableScroll, privateData: any) {
        super();

        this.privateData = privateData;
        this.initalScrollTop = privateData.scrollTop || 0;
        this.elm = target.scrollingElm;
    }

    public setup(): void {
        this.privateData.scrollTop = this.privateData.scrollTop || 0;
    }

    public destory(): void { }

    public updatePrivateData(): void {
        this.privateData.scrollTop = this.elm.scrollTop;
    }

    public apply(): void {
        this.elm.scrollBy(0, this.initalScrollTop);
    }

    public async applyScrollDownWithTransition(): Promise<void> {
        const dy = this.initalScrollTop - this.elm.scrollTop;
        if (dy <= 0) { return; }

        const thatElm = this.elm;

        let lastDY = 0;
        let startTime = performance.now();

        function reqanf(now: number) {
            let step = (now - startTime) / SaveScroll.scrollTransitionSpeed;
            if (step > 1) {
                step = 1;
            } else {
                requestAnimationFrame(reqanf);
            }

            const ddy = dy * easeOutExp(step) - lastDY;
            thatElm.scrollBy(0, ddy);

            lastDY += Math.floor(ddy);
        }

        requestAnimationFrame(reqanf);
    }

    public hasScrolled(): boolean {
        return this.initalScrollTop !== 0;
    }
}

export default SaveScroll;