import ContentParser from "./ContentParser";
import * as fsPromise from "./utils/fsPromise";
import * as path from "path";
import { V2Project } from "../../src/types/project/v2/V2Types";
import { ParseError, parseV2String } from "./utils/parseV2String";

export class ThingyProjectReadmeFinder {
    private projects: V2Project[] = [];

    public async readThingyDirectories(): Promise<V2Project[]> {
        const directories = await fsPromise.readdir(ContentParser.thingyDirectory);
        const thingyDirectories = directories.filter(dirName => dirName.startsWith("Thingy_"));

        const promises = [];

        for (const thingyDirectory of thingyDirectories) {
            promises.push(this.readThingyDirectory(thingyDirectory));
        }

        await Promise.all(promises);
        return this.projects;
    }

    private async readThingyDirectory(dirname: string) {
        const projects = await fsPromise.readdir(path.join(ContentParser.thingyDirectory, dirname));

        const promises = [];

        for (const project of projects) {
            const projectPath = path.join(ContentParser.thingyDirectory, dirname, project);
            promises.push(
                fsPromise.stat(projectPath).then(stat => {
                    if (stat.isDirectory()) {
                        return this.readReadmeFile(dirname, project);
                    }
                })
            );
        }

        return Promise.all(promises);
    }

    private async readReadmeFile(thingyDirectoryName: string, projectPath: string) {
        const files = await fsPromise.readdir(path.join(ContentParser.thingyDirectory, thingyDirectoryName, projectPath));

        const readmeFileName = files.find(filename => filename.toLowerCase().startsWith("readme"));
        if (!readmeFileName) {
            return;
        }

        const file = await fsPromise.readFile(
            path.join(ContentParser.thingyDirectory, thingyDirectoryName, projectPath, readmeFileName)
        ).then(data => data.toString());

        try {
            const projects = parseV2String(file);
            for (const project of projects) {
                if (!project.head.link) {
                    project.head.link = "/" + path.join(thingyDirectoryName, projectPath) + "/";
                }
                this.projects.push(project);
                console.log("Added:", project.head.name);
            }
        } catch (err) {
            console.log("Skipped:", thingyDirectoryName, projectPath, readmeFileName);
            if (!(err instanceof ParseError)) {
                throw err;
            }
        }
    }
}