import { sampleSize } from "lodash-es";
import type { DataSetItem } from "../types";

export class WordMatchService {
    constructor() {
        this.items = [];
    }

    private items: DataSetItem[];

    getRandomItems(count: number) {
        return sampleSize(this.items, count);
    }

    addRoundItems(items: DataSetItem[]) {
        this.items = items;
    }
}