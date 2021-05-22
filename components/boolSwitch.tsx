import * as b from "bobril";

export function BoolSwitch(p: { prop: b.IProp<boolean> }) {
    return (
        <span
            style={{ width: 10, display: "inline-block" }}
            onClick={() => p.prop(!p.prop())}
        >
            {p.prop() ? "-" : "+"}
        </span>
    );
}
