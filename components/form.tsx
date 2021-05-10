import * as b from "bobril";

export function Form(p: { children: b.IBobrilNode[] }) {
    return <div style={{ display: "table" }}>{p.children}</div>;
}

export function FormRow<T>(p: {
    label: string;
    value: b.IProp<T>;
    type: string;
}) {
    return (
        <label style={{ display: "table-row" }}>
            <span style={{ display: "table-cell" }}>{p.label}:</span>
            <input type={p.type} value={p.value} style={{ margin: "3px" }} />
        </label>
    );
}

export function Button(p: { text: string; onClick: () => void }) {
    return <input type="button" value={p.text} onClick={p.onClick} />;
}
