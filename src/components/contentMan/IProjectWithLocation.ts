import IProject from "../../types/project/IProject";

export default interface IProjectWithLocation {
    project: IProject;
    year: number;
    index: number;
};