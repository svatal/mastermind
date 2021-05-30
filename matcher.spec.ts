import { match } from "./matcher";
import { getCachedGetLetterUsageCounts } from "./utils";

describe("matcher", () => {
    it("exact", () => {
        const result = match("1234", "1555", getCachedGetLetterUsageCounts());
        expect(result).toEqual({ exact: 1, color: 0 });
    });
    it("color", () => {
        const result = match("1234", "5551", getCachedGetLetterUsageCounts());
        expect(result).toEqual({ exact: 0, color: 1 });
    });
    it("match", () => {
        const result = match("1234", "1234", getCachedGetLetterUsageCounts());
        expect(result).toEqual({ exact: 4, color: 0 });
    });
    it("matches colors", () => {
        const result = match("1234", "4321", getCachedGetLetterUsageCounts());
        expect(result).toEqual({ exact: 0, color: 4 });
    });
    it("combinations", () => {
        const result = match("1234", "1122", getCachedGetLetterUsageCounts());
        expect(result).toEqual({ exact: 1, color: 1 });
    });
});
