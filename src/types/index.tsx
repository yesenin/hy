export interface Word {
    id: string;
    value: string;
    audioUrl?: string;
}

export interface DataSetItem {
    id: string;
    value: string;
    translation: string;
    speechUrl: string;
    kind: string;
}