import View from "../../../core/view/view";

interface IFrameView extends View {
    setPath(path: string): void;
    animateTransitionIn(): void;
}

export default IFrameView;