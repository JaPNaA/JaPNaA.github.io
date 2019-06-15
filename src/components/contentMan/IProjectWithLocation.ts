import IProject from "../../types/project/project";

export default interface IProjectWithLocation {
    project: IProject;
    year: number;
    index: number;
};