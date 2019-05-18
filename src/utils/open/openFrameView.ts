import IApp from "../../types/app/iApp";
import FrameView from "../../elm/views/views/frameView";
import createAppState from "../createViewState";

export default function openFrameView(app: IApp, href: string): FrameView {
    const frameView = new FrameView(app, createAppState(FrameView, href));
    frameView.animateTransitionIn();
    frameView.setup();
    app.views.add(frameView);
    return frameView;
}