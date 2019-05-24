import IApp from "../core/types/app/iApp";
import FrameView from "../elm/views/frameView/frameView";
import createAppState from "../core/utils/createViewState";

export default function openFrameView(app: IApp, href: string): FrameView {
    const frameView = new FrameView(app, createAppState(FrameView, href));
    frameView.animateTransitionIn();
    frameView.setup();
    app.views.add(frameView);
    return frameView;
}