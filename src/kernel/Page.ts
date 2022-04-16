import { Option, none, some } from "fp-ts/lib/Option";

export abstract class Page<T extends {}> {
    readonly previous: Option<number>;
    readonly next: Option<number>;

    constructor(
        readonly data: T[], 
        readonly total: number, 
        readonly limit: number, 
        readonly offset: number
    ) {
        this.previous = this.getPrevious(total, limit, offset);
        this.next = this.getNext(total, limit, offset, this.getLastOffset(total, limit));
    }

    private getPrevious(total: number, limit: number, offset: number): Option<number> {
        return offset <= 0 || total < limit ? none : some(offset - limit);
    }

    private getLastOffset(total: number, limit: number): number {
        return total % limit === 0 ? 
            Math.floor(total / limit) * limit - limit :
            Math.floor(total / limit) * limit;
    }

    private getNext(total: number, limit: number, offset: number, lastOffset: number): Option<number> {
        if (total === limit || lastOffset === 0 || offset >= lastOffset) {   
            return none;
        }
        return some(offset + limit);
    }
}