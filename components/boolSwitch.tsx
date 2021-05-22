import * as b from "bobril";

export function BoolSwitch(p: { prop: b.IProp<boolean>; isDisabled: boolean }) {
    return (
        <span
            style={{ width: 10, display: "inline-block" }}
            onClick={() => !p.isDisabled && p.prop(!p.prop())}
        >
            {p.isDisabled ? " " : p.prop() ? "-" : "+"}
        </span>
    );
}
