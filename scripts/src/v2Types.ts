export type ProjectBodyElement = ProjectBodyImage | ProjectBodyMarkdown | ProjectBodyViewProject;

export interface ProjectBodyImage {
    type: "image";
    src: string;
    caption?: string;
}

export interface ProjectBodyMarkdown {
    type: "markdown";
    text: string;
}

export interface ProjectBodyViewProject {
    type: "view-project";
    href: string;
}

export interface Project {
    head: {
        name: string;
        link?: string;
        tags?: string[];
        author?: string[];
        timestamp?: number;
        shortDescription?: string;
        background?: string[];
        textColor?: string;
    };

    body: ProjectBodyElement[];
}

export default interface V2Header {
    tags?: string[];
    author?: string[];
    shortDescription?: string;
    timestamp?: number;
    background?: string[];
    textColor?: string;
}