import View from "../../../core/view/View";
import V1Or2Card from "../../../components/contentMan/V1Or2Card";

interface IProjectInfoView extends View {
    setProject(project: V1Or2Card, year: number, index: number): void;
}

export default IProjectInfoView;