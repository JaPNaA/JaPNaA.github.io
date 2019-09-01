import View from "../view/View";

type BeforeSetupCallback<T extends View> = (view: T) => void;

export default BeforeSetupCallback;