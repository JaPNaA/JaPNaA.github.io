import View from "../../../core/view/View";
import IV1Card from "../../../types/project/v1/IV1Card";

interface IProjectInfoView extends View {
    setProject(project: IV1Card, year: number, index: number): void;
}

export default IProjectInfoView;