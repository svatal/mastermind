import * as b from "bobril";
import { generateAll } from "../generator";
import { IOptions } from "../settings";
import { IBestSplit } from "../solutionEnumerator";
import { IState, step } from "../steppedSolutionEnumerator";
import {
    getCachedGetLetterUsageCounts,
    GetLetterUsageCounts,
    Guess,
} from "../utils";
import { StateNode } from "./stateNode";

export function SolutionEnumerator(p: {
    options: IOptions;
    getBestSplit: () => (
        candidates: Guess[],
        problemSpace: Guess[],
        getLetterUsageCounts: GetLetterUsageCounts
    ) => IBestSplit;
    paused: boolean;
}) {
    const all = b.useStore(() => generateAll(p.options));
    const root = b.useStore(() => ({ size: all.length } as IState));
    const toDo = b.useStore(() => [root]);
    const [steps, setSteps] = b.useState(0);
    const [timeTaken, setTimeTaken] = b.useState(0);
    const timeoutRef = b.useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined
    );
    const getLetterUsageCounts = b.useStore(getCachedGetLetterUsageCounts);
    const getBestSplit = b.useStore(p.getBestSplit);
    const oneStep = b.useCallback(() => {
        const then = performance.now();
        const current = toDo.pop();
        if (!current) {
            timeoutRef.current = undefined;
            return;
        }
        const processedState = step(
            all,
            p.options,
            getBestSplit,
            current,
            getLetterUsageCounts
        );
        toDo.push(...processedState.children);
        setSteps((steps) => steps + 1); // invalidate
        setTimeTaken((t) => t + (performance.now() - then));
        timeoutRef.current = setTimeout(oneStep);
    }, []);
    b.useEffect(() => {
        !p.paused && oneStep();
        return () => {
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [p.paused]); // start the evaluation
    return (
        <div>
            <div>processing buffer: {toDo.length}</div>
            <div>steps taken: {steps}</div>
            <div>avg time per step: {timeTaken / steps}</div>
            <StateNode state={root} />
        </div>
    );
}
