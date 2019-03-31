import View from "../../elm/views/view";

export default interface IAppURL {
    pushHistory(view: View): void;
    update(): void;
}