export type V2ProjectBodyElement = V2ProjectBodyImage | V2ProjectBodyMarkdown | V2ProjectBodyViewProject;

export type V2ProjectBody = V2ProjectBodyElement[] | string;

export interface V2ProjectBodyImage {
    type: "image";
    src: string;
    caption?: string;
}

export interface V2ProjectBodyMarkdown {
    type: "markdown";
    text: string;
}

export interface V2ProjectBodyViewProject {
    type: "view-project";
    href: string;
}

export interface V2Project {
    head: {
        name: string;
        timestamp: number;
        no: number;
        link?: string;
        tags?: string[];
        author?: string[];
        shortDescription?: string;
        background?: string[];
        textColor?: string;
    };

    body: V2ProjectBody;
}

export interface InputV2Header {
    tags?: string[];
    author?: string[];
    shortDescription?: string;
    timestamp: number;
    background?: string[];
    textColor?: string;
}

export interface V2ProjectListing {
    formatVersion: '2';
    data: V2Project[];
}

export function isV2ProjectListing(x: any): x is V2ProjectListing {
    return x && x.formatVersion === '2';
}