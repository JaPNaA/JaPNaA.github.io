export default function sitemapEntryToPath(year: number, index: number): string {
    return "https://gh.japnaa.dev/projectinfo?" + year + "." + index;
}