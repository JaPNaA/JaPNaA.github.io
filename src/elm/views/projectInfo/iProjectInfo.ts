import View from "../../../core/view/view";
import ICard from "../../../types/project/card";

interface IProjectInfoView extends View {
    setProject(project: ICard, year: number, index: number): void;
}

export default IProjectInfoView;