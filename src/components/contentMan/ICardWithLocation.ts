import ICard from "../../types/project/ICard";

export default interface ICardWithLocation {
    project: ICard;
    year: number;
    index: number;
};