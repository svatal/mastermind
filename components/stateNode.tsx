import * as b from "bobril";
import {
    IState,
    isResultState,
    isSolvedState,
    isProcessedState,
    isGuessState,
} from "../steppedSolutionEnumerator";
import { BoolSwitch } from "./boolSwitch";

export function StateNode(p: { state: IState }) {
    const isExpanded = b.useState(false);
    const { state } = p;
    const haveChildren = isProcessedState(state) && state.children.length > 0;
    return (
        <div>
            <BoolSwitch prop={isExpanded} isDisabled={!haveChildren} />
            {isResultState(state) && `${state.result} `}({state.size}){" "}
            {isGuessState(state) && `-> ${state.guess} `}
            {!isProcessedState(state) && "⌛"}
            {isSolvedState(state) && `max ${state.max}, avg ${state.avg}`}
            {isProcessedState(state) && haveChildren && (
                <div
                    key="children"
                    style={{
                        marginLeft: 10,
                        display: isExpanded() ? "block" : "none",
                    }}
                >
                    {state.children.map((c) => (
                        <StateNode state={c} />
                    ))}
                </div>
            )}
        </div>
    );
}
