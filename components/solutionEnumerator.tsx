import * as b from "bobril";
import { generateAll } from "../generator";
import { IOptions } from "../settings";
import { IBestSplit } from "../solutionEnumerator";
import { ISolvedState, IState, step } from "../steppedSolutionEnumerator";
import { Guess } from "../utils";
import { StateNode } from "./stateNode";

export function SolutionEnumerator(p: {
    options: IOptions;
    getBestSplit: () => (
        candidates: Guess[],
        problemSpace: Guess[]
    ) => IBestSplit;
}) {
    const all = b.useStore(() => generateAll(p.options));
    const root = b.useStore(() => ({ size: all.length } as IState));
    const toDo = b.useStore(() => [root]);
    const [steps, setSteps] = b.useState(0);
    const oneStep = b.useCallback(() => {
        const current = toDo.pop();
        if (!current) {
            return;
        }
        const processedState = step(all, p.options, p.getBestSplit(), current);
        toDo.push(...processedState.children);
        setSteps((steps) => steps + 1); // invalidate
        setTimeout(oneStep);
    }, []);
    b.useEffect(() => oneStep(), []); // start the evaluation
    return (
        <div>
            <div>processing buffer: {toDo.length}</div>
            <div>steps taken: {steps}</div>
            <StateNode state={root} />
        </div>
    );
}
