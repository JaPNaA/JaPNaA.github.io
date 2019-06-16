import ICard from "../../types/project/card";

export default interface ICardWithLocation {
    project: ICard;
    year: number;
    index: number;
};