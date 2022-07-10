import { isSome } from "fp-ts/lib/Option";
import { Page } from "./page";

export class PageResponse<T extends {}> {
    readonly total: number;
    readonly previous: string | null;
    readonly next: string | null;
    readonly data: T[];

    constructor(page: Page<T>, url: URL) {
        this.data = page.data;
        this.total = page.total;
        this.previous = this.getPreviousStringUrl(page, url);
        this.next = this.getNextStringUrl(page, url);
    }

    private getPreviousStringUrl(page: Page<T>, url: URL): string | null {
        if (isSome(page.previous)) {
            url.searchParams.set("limit", String(page.limit));
            url.searchParams.set("offset", String(page.previous.value));
            return url.toString();
        }
        return null;
    }

    private getNextStringUrl(page: Page<T>, url: URL): string | null {
        if (isSome(page.next)) {
            url.searchParams.set("limit", String(page.limit));
            url.searchParams.set("offset", String(page.next.value));
            return url.toString();
        }
        return null;
    }
}