import { solve } from "./solutionEnumerator";
import * as knuthAlg from "./knuthAlg";
import { IOptions } from "./settings";

const options: IOptions = {
    colorCount: 8,
    positionCount: 5,
    repetition: false,

    // colorCount: 6,
    // positionCount: 4,
    // repetition: true,
};
const result = solve(options, knuthAlg.getAlg(options));
console.log(result);
