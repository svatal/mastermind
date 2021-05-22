import * as b from "bobril";
import {
    IState,
    isGuessState,
    isSolvedState,
} from "../steppedSolutionEnumerator";
import { BoolSwitch } from "./boolSwitch";

export function StateNode(p: { state: IState }) {
    const isExpanded = b.useState(false);
    const { state } = p;
    return (
        <div>
            <BoolSwitch prop={isExpanded} />
            {isGuessState(state) && `${state.guess} -> ${state.result} `}(
            {state.size}) {state.children === undefined && "⌛"}
            {isSolvedState(state) && `max ${state.max}, avg ${state.avg}`}
            <div
                style={{
                    marginLeft: 10,
                    display: isExpanded() ? "block" : "none",
                }}
            >
                {state.children?.map((c) => (
                    <StateNode state={c} />
                ))}
            </div>
        </div>
    );
}
