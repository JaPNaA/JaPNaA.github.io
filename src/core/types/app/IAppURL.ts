import View from "../../view/View";

export default interface IAppURL {
    pushHistory(view: View): void;
    updateViewIfIsCurrent(view: View): void;
    update(): void;
}