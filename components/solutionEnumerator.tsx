import * as b from "bobril";
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
    const timeoutRef = b.useRef<ReturnType<typeof setTimeout>>(undefined);
    const oneStep = b.useCallback(() => {
        const current = toDo.pop();
        if (!current) {
            return;
        }
        const processedState = step(all, p.options, p.getBestSplit(), current);
        toDo.push(...processedState.children);
        setSteps((steps) => steps + 1); // invalidate
        timeoutRef.current = setTimeout(oneStep);
    }, []);
    b.useEffect(() => {
        !p.paused && oneStep();
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [p.paused]); // start the evaluation
    return (
        <div>
            <div>processing buffer: {toDo.length}</div>
            <div>steps taken: {steps}</div>
            <StateNode state={root} />
        </div>
    );
}
