import * as knuthAlg from "./knuthAlg";
import { IOptions } from "./settings";
import * as b from "bobril";
import { Button, Form, FormRow } from "./components/form";
import { SolutionEnumerator } from "./components/solutionEnumerator";

b.init(() => {
    const colorCount = b.useState(8);
    const positionCount = b.useState(5);
    const repetition = b.useState(false);
    const [formComplete, setFormComplete] = b.useState(false);
    const options: IOptions = {
        colorCount: colorCount(),
        positionCount: positionCount(),
        repetition: repetition(),
    };
    return (
        <>
            <Form>
                <FormRow label="Color count" type="number" value={colorCount} />
                <FormRow
                    label="Position count"
                    type="number"
                    value={positionCount}
                />
                <FormRow
                    label="Repetition"
                    type="checkbox"
                    value={repetition}
                />
            </Form>
            {formComplete ? (
                <SolutionEnumerator
                    getBestSplit={() => knuthAlg.getAlg(options)}
                    options={options}
                />
            ) : (
                <Button
                    text="Solve (in console)"
                    onClick={() => {
                        setFormComplete(true);
                    }}
                />
            )}
        </>
    );
});
