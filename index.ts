import { solve } from "./solutionEnumerator";
import * as knuthAlg from "./knuthAlg";

const result = solve(knuthAlg.getBest);
console.log(result);
