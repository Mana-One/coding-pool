export interface Usecase<TInput, TOutput> {
    execute(input: TInput): Promise<TOutput>;
}