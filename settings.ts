import { createMatchResult } from "./utils";

export interface IOptions {
    colorCount: number;
    positionCount: number;
    repetition: boolean;
}

export function getSuccessResult(o: IOptions) {
    return createMatchResult({
        exact: o.positionCount,
        color: 0,
    });
}
