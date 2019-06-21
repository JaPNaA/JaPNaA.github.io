import View from "../../../core/view/view";

interface IImageView extends View {
    setImageSrc(src: string): void;
    setInitalTransform(x: number, y: number, scale: number): void;
    transitionIn(): void;
}

export default IImageView;