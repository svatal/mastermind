// import { solve } from "./solutionEnumerator";
import * as knuthAlg from "./knuthAlg";
import { IOptions } from "./settings";
import * as b from "bobril";
import { Button, Form, FormRow } from "./components/form";
import { solve } from "./steppedSolutionEnumerator";

const colorCount = b.propi(8);
const positionCount = b.propi(5);
const repetition = b.propi(false);

b.init(() => (
    <>
        <Form>
            <FormRow label="Color count" type="number" value={colorCount} />
            <FormRow
                label="Position count"
                type="number"
                value={positionCount}
            />
            <FormRow label="Repetition" type="checkbox" value={repetition} />
        </Form>
        <Button
            text="Solve (in console)"
            onClick={() => {
                const options: IOptions = {
                    colorCount: colorCount(),
                    positionCount: positionCount(),
                    repetition: repetition(),
                };
                const result = solve(options, knuthAlg.getAlg(options));
                console.log(result);
            }}
        />
    </>
));
