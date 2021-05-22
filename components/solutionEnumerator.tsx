import * as b from "bobril";
import { useRef } from "bobril";
import { generateAll } from "../generator";
import { IOptions } from "../settings";
import { IBestSplit } from "../solutionEnumerator";
import { IState, step } from "../steppedSolutionEnumerator";
import { Guess } from "../utils";
import { StateNode } from "./stateNode";

export function SolutionEnumerator(p: {
    options: IOptions;
    getBestSplit: () => (
        candidates: Guess[],
        problemSpace: Guess[]
    ) => IBestSplit;
    paused: boolean;
}) {
    const all = b.useStore(() => generateAll(p.options));
    const root = b.useStore(() => ({ size: all.length } as IState));
    const toDo = b.useStore(() => [root]);
    const [steps, setSteps] = b.useState(0);
    const paused = useRef(p.paused);
    paused(p.paused); // pass the paused property into oneStep callback
    const oneStep = b.useCallback(() => {
        if (paused.current) {
            return;
        }
        const current = toDo.pop();
        if (!current) {
            return;
        }
        const processedState = step(all, p.options, p.getBestSplit(), current);
        toDo.push(...processedState.children);
        setSteps((steps) => steps + 1); // invalidate
        setTimeout(oneStep);
    }, []);
    b.useEffect(() => {
        !p.paused && oneStep();
    }, [p.paused]); // start the evaluation
    return (
        <div>
            <div>processing buffer: {toDo.length}</div>
            <div>steps taken: {steps}</div>
            <StateNode state={root} />
        </div>
    );
}
