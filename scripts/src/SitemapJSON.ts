import sitemapEntryToPath from "./utils/sitemapEntryToPath";
import { writeFile } from "./utils/fsPromise";
import path from "path";
import ContentParser from "./ContentParser";

interface SitemapEntry {
    year: number,
    index: number,
    date?: Date
}

class SitemapJSON {
    private static readonly outName = "projectsSitemap.xml";

    private entries: SitemapEntry[];

    constructor() {
        this.entries = [];
    }

    public addProject(project: SitemapEntry) {
        this.entries.push(project);
    }

    public async writeOut() {
        const str = this.toString();
        await writeFile(
            path.join(ContentParser.outDirectory, SitemapJSON.outName),
            str
        );
    }

    private toString(): string {
        let body = "";

        for (const entry of this.entries) {
            body += "<url><loc>" +
                this.escapeForXML(sitemapEntryToPath(entry.year, entry.index)) +
                "</loc>";

            if (entry.date !== undefined) {
                body += "<lastmod>" +
                    entry.date.getUTCFullYear() + "-" +
                    (entry.date.getUTCMonth() + 1) + "-" +
                    entry.date.getUTCDate() +
                    "</lastmod>";
            }

            body += "<changefreq>never</changefreq><priority>0.5</priority></url>";
        }

        return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            body +
            '</urlset>';
    }

    private escapeForXML(str: string) {
        return (str.replace(/&/g, "&amp;")
            .replace(/'/g, "&apos;")
            .replace(/"/g, "&quot;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
        );
    }
}

export default SitemapJSON;