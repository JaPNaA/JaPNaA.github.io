import View from "../../../core/view/View";
import ICard from "../../../types/project/v1/ICard";

interface IProjectInfoView extends View {
    setProject(project: ICard, year: number, index: number): void;
}

export default IProjectInfoView;