import IProject from "../../types/project/project";
import SiteResources from "../../siteResources";
import SiteConfig from "../../siteConfig";
import IIndex from "../../types/project/index";
import IInfoJSON from "../../types/project/infojson";

class ContentMan {
    static index?: IIndex;
    static indexPromise: Promise<IIndex>;

    public static setup(): void { }

    public static async *cardGeneratorOldest(): AsyncIterableIterator<IProject> {
        let index = await this.getIndex();

        for (let year = index.start; year <= index.end; year++) {
            const list = await this.getFileForYear(year);

            for (const project of list.data) {
                yield project;
            }
        }
    }

    public static async *cardGeneratorLatest(): AsyncIterableIterator<IProject> {
        let index = await this.getIndex();

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

    private static async getFileForYear(year: number): Promise<IInfoJSON> {
        const index = await this.getIndex();
        return new Promise<IInfoJSON>(res =>
            SiteResources.loadJSON(SiteConfig.path.content + this.replaceYearPath(index.pattern, year))
                .onLoad(e => res(e.data as IInfoJSON))
        );
    }

    private static replaceYearPath(pattern: string, year: number): string {
        return pattern.replace("[year]", year.toString());
    }
}

export default ContentMan;