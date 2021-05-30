import { bind } from "bobril";

export class ResultsCache<TInput, TOutput, TSimpleKey extends number | string> {
    private cached = new Map<TSimpleKey, TOutput>();
    constructor(
        private processor: (input: TInput) => TOutput,
        private serializeInput: (input: TInput) => TSimpleKey
    ) {}

    @bind process(input: TInput): TOutput {
        const key = this.serializeInput(input);
        const cachedResult = this.cached.get(key);
        if (cachedResult !== undefined) return cachedResult;
        const result = this.processor(input);
        this.cached.set(key, result);
        return result;
    }
}
