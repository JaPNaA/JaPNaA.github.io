import IProject from "../../types/project/v1/IProject";

export default interface IProjectWithLocation {
    project: IProject;
    year: number;
    index: number;
};