import View from "../../view/View";

export default interface ViewWithFallbackStatus {
    isFallback: boolean;
    view: View;
};