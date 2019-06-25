import IProject from "../../types/project/IProject";
import siteResources from "../../core/siteResources";
import SiteConfig from "../../SiteConfig";
import IIndex from "../../types/project/IIndex";
import IInfoJSON from "../../types/project/IInfojson";
import ICard from "../../types/project/ICard";
import isProjectCard from "../../utils/isProjectCard";
import IProjectWithLocation from "./IProjectWithLocation";
import IProjectLink from "./IProjectLink";
import ICardWithLocation from "./ICardWithLocation";

type LinksIndexJSON = [number, string, string][];

// TODO: Make this function like a lazyily evaluated array

class ContentMan {
    static projectsIndex?: IIndex;
    static projectsIndexPromise: Promise<IIndex>;

    static linksIndex?: LinksIndexJSON;
    static linksIndexPromise: Promise<LinksIndexJSON>;

    public static setup(): void { }

    public static async getCardByNumber(no: number): Promise<ICard | null> {
        const index = await this.getProjectsIndex();
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

    public static async *cardAndLinkGeneratorOldestWithLocation(): AsyncIterableIterator<ICardWithLocation | IProjectLink> {
        const linksIndex = await this.getLinksIndex();

        for (const thingy of linksIndex) {
            const [year, thingyName, thingyPath] = thingy;
            const links = await this.getLinksForThingy(thingyPath);
            const projectsMap = await this.createProjectsMap(year);
            const linksOrProjectGen = this.yieldLinksOrProjectsIfExistsAndDeleteFromMap(links, projectsMap, thingyPath);

            for (const linkOrProject of linksOrProjectGen) {
                yield linkOrProject;
            }

            // clear out any remaining projects
            for (const [key, project] of projectsMap) {
                yield project;
            }
        }
    }

    public static async *cardAndLinkGeneratorLatestWithLocation(): AsyncIterableIterator<ICardWithLocation | IProjectLink> {
        const linksIndex = await this.getLinksIndex();

        for (let i = linksIndex.length - 1; i >= 0; i--) {
            const [year, thingyName, thingyPath] = linksIndex[i];
            const links = await this.getLinksForThingy(thingyPath);
            const projectsMap = await this.createProjectsMap(year);
            const linksOrProjectGen = this.yieldLinksOrProjectsIfExistsAndDeleteFromMap(links, projectsMap, thingyPath);

            for (const linkOrProject of linksOrProjectGen) {
                yield linkOrProject;
            }

            // clear out any remaining projects
            for (const [key, project] of projectsMap) {
                yield project;
            }
        }
    }

    private static async createProjectsMap(year: number): Promise<Map<string, ICardWithLocation>> {
        const projectsMap = new Map<string, ICardWithLocation>();

        try {
            const projects = await this.getFileForYear(year);

            for (let i = 0; i < projects.data.length; i++) {
                const project = projects.data[i];
                if (isProjectCard(project)) {
                    projectsMap.set(project.content.link, { project: project, index: i, year: year });
                }
            }
        } catch (err) {
            console.warn(err);
        }

        return projectsMap;
    }

    private static *yieldLinksOrProjectsIfExistsAndDeleteFromMap(links: string[][], projectsMap: Map<string, ICardWithLocation>, thingyPath: string): IterableIterator<ICardWithLocation | IProjectLink> {
        for (const link of links) {
            const [name, href] = link;
            const key = thingyPath + href;
            const project = projectsMap.get(thingyPath + href);
            if (project) {
                projectsMap.delete(key);
                yield project;
            } else {
                yield {
                    name: name,
                    href: SiteConfig.path.thingy + thingyPath + href
                };
            }
        }
    }

    public static async *cardGeneratorOldestWithLocation(): AsyncIterableIterator<IProjectWithLocation> {
        const index = await this.getProjectsIndex();

        for (let year = index.start; year <= index.end; year++) {
            const list = await this.getFileForYear(year);

            for (let i = 0; i < list.data.length; i++) {
                const project = list.data[i];
                yield { project: project, index: i, year: year };
            }
        }
    }

    public static async *cardGeneratorLatestWithLocation(): AsyncIterableIterator<IProjectWithLocation> {
        const index = await this.getProjectsIndex();

        for (let year = index.end; year >= index.start; year--) {
            const list = await this.getFileForYear(year);

            for (let i = list.data.length - 1; i >= 0; i--) {
                const project = list.data[i];
                yield { project: project, index: i, year: year };
            }
        }
    }

    public static async *cardGeneratorOldest(): AsyncIterableIterator<IProject> {
        const gen = this.cardGeneratorOldestWithLocation();
        for await (const item of gen) {
            yield item.project;
        }
    }

    public static async *cardGeneratorLatest(): AsyncIterableIterator<IProject> {
        const gen = this.cardGeneratorLatestWithLocation();
        for await (const item of gen) {
            yield item.project;
        }
    }

    private static async getProjectsIndex(): Promise<IIndex> {
        if (this.projectsIndex) {
            return this.projectsIndex;
        } else if (this.projectsIndexPromise) {
            return this.projectsIndexPromise;
        } else {
            const prom = new Promise<IIndex>(res =>
                siteResources.loadJSON(SiteConfig.path.contentIndex)
                    .onLoad(e => res(e.data as IIndex))
            );
            this.projectsIndexPromise = prom;
            return prom;
        }
    }

    private static async getLinksIndex(): Promise<LinksIndexJSON> {
        if (this.linksIndex) {
            return this.linksIndex;
        } else if (this.linksIndexPromise) {
            return this.linksIndexPromise;
        } else {
            const prom = new Promise<LinksIndexJSON>(res =>
                siteResources.loadJSON(SiteConfig.path.thingy + SiteConfig.path.repo.thingy + SiteConfig.path.repo.linksIndex)
                    .onLoad(e => res(e.data as LinksIndexJSON))
            );
            this.linksIndexPromise = prom;
            return prom;
        }
    }

    private static async getFileForYear(year: number | string): Promise<IInfoJSON> {
        const index = await this.getProjectsIndex();
        return new Promise<IInfoJSON>((res, rej) =>
            siteResources.loadJSON(SiteConfig.path.content + this.replaceYearPath(index.pattern, year))
                .onLoad(e => res(e.data as IInfoJSON))
                .onError(() => rej(new Error("Failed to load file for year " + year)))
        );
    }

    private static async getLinksForThingy(thingyPath: string): Promise<string[][]> {
        return new Promise<string[][]>((res, rej) =>
            siteResources.loadJSON(SiteConfig.path.thingy + thingyPath + SiteConfig.path.repo.linksIndex)
                .onLoad(e => res(e.data as string[][]))
                .onError(() => rej(new Error("Failed to load links in " + thingyPath)))
        );
    }

    private static replaceYearPath(pattern: string, year: number | string): string {
        return pattern.replace("[year]", year.toString());
    }
}

export default ContentMan;