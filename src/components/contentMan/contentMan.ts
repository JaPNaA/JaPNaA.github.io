import ICard from "../../types/project/card";
import IText from "../../types/project/text";
import IProject from "../../types/project/project";
import SiteResources from "../../siteResources";
import SiteConfig from "../../siteConfig";
import IIndex from "../../types/project/index";
import IInfoJSON from "../../types/project/infojson";

class ContentMan {
    constructor() {
        //
    }

    public getLatestCard(index: number): ICard {
        throw new Error("not implemented");
    }

    public getLatestText(index: number): IText {
        throw new Error("not implemented");
    }

    public getCardByNumber(number: number): ICard {
        throw new Error("not implemented");
    }

    public getCardByIndex(index: number): ICard {
        throw new Error("not implemented");
    }

    public async *cardGeneratorOldest(): AsyncIterableIterator<IProject> {
        let index = await new Promise<IIndex>(res =>
            SiteResources.loadJSON(SiteConfig.path.contentIndex)
                .onLoad(e => res(e as any as IIndex))
        );

        for (let year = index.start; year <= index.end; year++) {
            const list = await new Promise<IInfoJSON>(res =>
                SiteResources.loadJSON(SiteConfig.path.content + this.replaceYearPath(index.pattern, year))
                    .onLoad(e => res(e as any as IInfoJSON))
            );
            console.log(list);
        }
    }

    private replaceYearPath(pattern: string, year: number): string {
        return pattern.replace("[year]", year.toString());
    }
}