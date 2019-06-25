import View from "../../../core/view/View";

interface IFrameView extends View {
    setPath(path: string): void;
    animateTransitionIn(): void;
}

export default IFrameView;