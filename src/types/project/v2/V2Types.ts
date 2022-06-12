export type V2ProjectBodyElement = 
    V2ProjectBodyImage |
    V2ProjectBodyMarkdown |
    V2ProjectBodyViewProject |
    V2ProjectBodyViewSource;

export type V2ProjectBody = V2ProjectBodyElement[] | string;

export interface V2ProjectBodyImage {
    type: "image";
    src: string;
    pixels?: true;
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

export interface V2ProjectBodyViewSource {
    type: "view-source";
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
        accentColor?: string;
    };

    body: V2ProjectBody;
}

export interface InputV2Header {
    link?: string;
    tags?: string[];
    author?: string[];
    shortDescription?: string;
    timestamp: number;
    background?: string[];
    textColor?: string;
    accentColor?: string;
}

export interface V2ProjectListing {
    formatVersion: '2';
    data: V2Project[];
}