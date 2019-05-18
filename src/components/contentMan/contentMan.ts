import IProject from "../../types/project/project";
import SiteResources from "../../siteResources";
import SiteConfig from "../../siteConfig";
import IIndex from "../../types/project/index";
import IInfoJSON from "../../types/project/infojson";
import ICard from "../../types/project/card";
import isProjectCard from "../../utils/isProjectCard";

// TODO: Make this function like a lazyily evaluated array

class ContentMan {
    static index?: IIndex;
    static indexPromise: Promise<IIndex>;

    public static setup(): void { }

    public static async getCardByNumber(no: number): Promise<ICard | null> {
        const index = await this.getIndex();
        const years = Object.keys(index.meta);

        for (const year of years) {
            const range = index.meta[year];
            if (no < range[0] || no > range[1]) { continue; }
            const list = await this.getFileForYear(year);

            for (const item of list.data) {
                if (isProjectCard(item) && item.no === no) {
                    return item;
                }
            }
        }

        return null;
    }

    public static async *cardGeneratorOldest(): AsyncIterableIterator<IProject> {
        const index = await this.getIndex();

        for (let year = index.start; year <= index.end; year++) {
            const list = await this.getFileForYear(year);

            for (const project of list.data) {
                yield project;
            }
        }
    }

    public static async *cardGeneratorLatest(): AsyncIterableIterator<IProject> {
        const index = await this.getIndex();

        for (let year = index.end; year >= index.start; year--) {
            const list = await this.getFileForYear(year);

            for (let i = list.data.length - 1; i >= 0; i--) {
                yield list.data[i];
            }
        }
    }

    private static async getIndex(): Promise<IIndex> {
        if (this.index) {
            return this.index;
        } else if (this.indexPromise) {
            return this.indexPromise;
        } else {
            const prom = new Promise<IIndex>(res =>
                SiteResources.loadJSON(SiteConfig.path.contentIndex)
                    .onLoad(e => res(e.data as IIndex))
            );
            this.indexPromise = prom;
            return prom;
        }
    }

    private static async getFileForYear(year: number | string): Promise<IInfoJSON> {
        const index = await this.getIndex();
        return new Promise<IInfoJSON>(res =>
            SiteResources.loadJSON(SiteConfig.path.content + this.replaceYearPath(index.pattern, year))
                .onLoad(e => res(e.data as IInfoJSON))
        );
    }

    private static replaceYearPath(pattern: string, year: number | string): string {
        return pattern.replace("[year]", year.toString());
    }
}

export default ContentMan;