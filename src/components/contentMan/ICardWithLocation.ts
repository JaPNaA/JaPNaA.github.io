import ICard from "../../types/project/v1/ICard";

export default interface ICardWithLocation {
    project: ICard;
    year: number;
    index: number;
};