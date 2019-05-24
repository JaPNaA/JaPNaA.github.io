import View from "../../view/view";

export default interface IAppURL {
    pushHistory(view: View): void;
    update(): void;
}