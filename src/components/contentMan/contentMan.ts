import siteResources from "../../core/siteResources";
import siteConfig from "../../SiteConfig";
import IIndex from "../../types/project/IIndex";
import IV1InfoJSON from "../../types/project/v1/IV1InfoJSON";
import isProjectV1Card from "../../utils/isProjectCard";
import IProjectLink from "./IProjectLink";
import { V2ProjectListing, V2Project, V2ProjectBodyElement } from "../../types/project/v2/V2Types";
import IWithLocation from "./IWithLocation";
import isV2ProjectListing from "../../utils/v2Project/isV2ProjectListing";
import V1Or2Card from "./V1Or2Card";
import V1Or2Project from "./V1Or2Project";

type LinksIndexJSON = [number, string, string][];

class ContentMan {
    static projectsIndex?: IIndex;
    static projectsIndexPromise: Promise<IIndex>;

    static linksIndex?: LinksIndexJSON;
    static linksIndexPromise: Promise<LinksIndexJSON>;

    public static setup(): void { }

    public static async getCardByNumber(no: number): Promise<V1Or2Card | null> {
        const index = await this.getProjectsIndex();
        const years = Object.keys(index.meta);

        for (const year of years) {
            const range = index.meta[year];
            if (no < range[0] || no > range[1]) { continue; }
            const list = await this.getFileForYear(year);

            if (isV2ProjectListing(list)) {
                for (const item of list.data) {
                    if (item.head.no === no) {
                        return item;
                    }
                }
            } else {
                for (const item of list.data) {
                    if (isProjectV1Card(item) && item.no === no) {
                        return item;
                    }
                }
            }
        }

        return null;
    }

    public static async getCardByYearAndIndex(year: number | string, cardIndex: number): Promise<V1Or2Project> {
        const list = await this.getFileForYear(year);
        return list.data[cardIndex];
    }

    public static async getV2CardBody(project: V2Project): Promise<V2ProjectBodyElement[]> {
        if (typeof project.body === "string") {
            return siteResources.loadJSONPromise(siteConfig.path.content + project.body);
        } else {
            return project.body;
        }
    }

    public static async *cardAndLinkGeneratorOldestWithLocation(): AsyncIterableIterator<IWithLocation<V1Or2Card> | IProjectLink> {
        const linksIndex = await this.getLinksIndex();

        for (const thingy of linksIndex) {
            const [year, thingyName, thingyPath] = thingy;
            const [links, projectsMap] = await Promise.all([
                this.getLinksForThingy(thingyPath),
                this.createProjectsMap(year)
            ]);
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

    public static async *cardAndLinkGeneratorLatestWithLocation(): AsyncIterableIterator<IWithLocation<V1Or2Card> | IProjectLink> {
        const linksIndex = await this.getLinksIndex();

        for (let i = linksIndex.length - 1; i >= 0; i--) {
            const [year, thingyName, thingyPath] = linksIndex[i];
            const [links, projectsMap] = await Promise.all([
                this.getLinksForThingy(thingyPath),
                this.createProjectsMap(year)
            ]);
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

    public static async getLinksForYear(year: number): Promise<IProjectLink[]> {
        const index = await this.getLinksIndex();
        const arr = [];

        for (const [thingyYear, name, thingyPath] of index) {
            if (thingyYear !== year) { continue; }
            const links = await this.getLinksForThingy(thingyPath);

            for (const link of links) {
                arr.push(this.linkToProjectLink(thingyPath, link))
            }

            break;
        }

        return arr;
    }

    private static async createProjectsMap(year: number): Promise<Map<string, IWithLocation<V1Or2Card>>> {
        const projectsMap = new Map<string, IWithLocation<V1Or2Card>>();

        try {
            const projects = await this.getFileForYear(year);
            if (isV2ProjectListing(projects)) {
                for (let i = 0; i < projects.data.length; i++) {
                    const project = projects.data[i];
                    if (project.head.link) {
                        projectsMap.set(project.head.link, { project: project, index: i, year: year });
                    }
                }
            } else {
                for (let i = 0; i < projects.data.length; i++) {
                    const project = projects.data[i];
                    if (isProjectV1Card(project)) {
                        projectsMap.set(project.content.link, { project: project, index: i, year: year });
                    }
                }
            }
        } catch (err) {
            console.warn(err);
        }

        return projectsMap;
    }

    private static *yieldLinksOrProjectsIfExistsAndDeleteFromMap(links: string[][], projectsMap: Map<string, IWithLocation<V1Or2Card>>, thingyPath: string): IterableIterator<IWithLocation<V1Or2Card> | IProjectLink> {
        for (const link of links) {
            const [name, href] = link;
            const key = thingyPath + href;
            const project = projectsMap.get(thingyPath + href);
            if (project) {
                projectsMap.delete(key);
                yield project;
            } else {
                yield this.linkToProjectLink(thingyPath, link);
            }
        }
    }

    public static async *cardGeneratorOldestWithLocation(): AsyncIterableIterator<IWithLocation<V1Or2Project>> {
        const index = await this.getProjectsIndex();

        for (let year = index.start; year <= index.end; year++) {
            const list = await this.getFileForYear(year);

            for (let i = 0; i < list.data.length; i++) {
                const project = list.data[i];
                yield { project: project, index: i, year: year };
            }
        }
    }

    public static async *cardGeneratorLatestWithLocation(): AsyncIterableIterator<IWithLocation<V1Or2Project>> {
        const index = await this.getProjectsIndex();

        for (let year = index.end; year >= index.start; year--) {
            const list = await this.getFileForYear(year);

            for (let i = list.data.length - 1; i >= 0; i--) {
                const project = list.data[i];
                yield { project: project, index: i, year: year };
            }
        }
    }

    public static async *cardGeneratorOldest(): AsyncIterableIterator<V1Or2Project> {
        const gen = this.cardGeneratorOldestWithLocation();
        for await (const item of gen) {
            yield item.project;
        }
    }

    public static async *cardGeneratorLatest(): AsyncIterableIterator<V1Or2Project> {
        const gen = this.cardGeneratorLatestWithLocation();
        for await (const item of gen) {
            yield item.project;
        }
    }

    public static async getFileForYear(year: number | string): Promise<IV1InfoJSON | V2ProjectListing> {
        const index = await this.getProjectsIndex();
        return new Promise((res, rej) =>
            siteResources.loadJSON(siteConfig.path.content + this.getPathForYear(index, year))
                .onLoad(e => res(e.data))
                .onError(() => rej(new Error("Failed to load file for year " + year)))
        );
    }

    public static async getProjectsIndex(): Promise<IIndex> {
        if (this.projectsIndex) {
            return this.projectsIndex;
        } else if (this.projectsIndexPromise) {
            return this.projectsIndexPromise;
        } else {
            const prom = new Promise<IIndex>(res =>
                siteResources.loadJSON(siteConfig.path.contentIndex)
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
                siteResources.loadJSON(siteConfig.path.thingy + siteConfig.path.repo.thingy + siteConfig.path.repo.linksIndex)
                    .onLoad(e => res(e.data as LinksIndexJSON))
            );
            this.linksIndexPromise = prom;
            return prom;
        }
    }

    private static async getLinksForThingy(thingyPath: string): Promise<string[][]> {
        return new Promise<string[][]>((res, rej) =>
            siteResources.loadJSON(siteConfig.path.thingy + thingyPath + siteConfig.path.repo.linksIndex)
                .onLoad(e => res(e.data as string[][]))
                .onError(() => rej(new Error("Failed to load links in " + thingyPath)))
        );
    }

    private static getPathForYear(index: IIndex, year: number | string): string {
        return index.meta[year][2];
    }

    private static linkToProjectLink(thingyPath: string, link: string[]): IProjectLink {
        return {
            name: link[0],
            href: siteConfig.path.thingy + thingyPath + link[1]
        };
    }
}

export default ContentMan;