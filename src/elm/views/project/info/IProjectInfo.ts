import View from "../../../../core/view/View";
import { V2Project } from "../../../../types/project/v2/V2Types";

interface IProjectInfoView extends View {
    setProject(project: V2Project, year: number, index: number): void;
    transitionFadeIn(): Promise<void>;
}

export default IProjectInfoView;