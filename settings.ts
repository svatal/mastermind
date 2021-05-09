import { createMatchResult } from "./utils";

export const colorCount = 8;
export const positionCount = 5;
export const repetition = false;

// export const colorCount = 6;
// export const positionCount = 4;
// export const repetition = true;

export const successResult = createMatchResult({
    exact: positionCount,
    color: 0,
});
