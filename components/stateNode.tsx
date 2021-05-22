import * as b from "bobril";
import { IState, isGuessState } from "../steppedSolutionEnumerator";
import { BoolSwitch } from "./boolSwitch";

export function StateNode(p: { state: IState }) {
    const isExpanded = b.useState(false);
    return (
        <div>
            <BoolSwitch prop={isExpanded} />
            {isGuessState(p.state) && `${p.state.guess} -> ${p.state.result} `}(
            {p.state.size}) {p.state.children === undefined && "⌛"}
            <div
                style={{
                    marginLeft: 10,
                    display: isExpanded() ? "block" : "none",
                }}
            >
                {p.state.children?.map((c) => (
                    <StateNode state={c} />
                ))}
            </div>
        </div>
    );
}
