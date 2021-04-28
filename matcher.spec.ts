import { match } from "./matcher";

describe("matcher", () => {
    it("exact", () => {
        const result = match("1234", "1555");
        expect(result).toEqual({ exact: 1, color: 0 });
    });
    it("color", () => {
        const result = match("1234", "5551");
        expect(result).toEqual({ exact: 0, color: 1 });
    });
    it("match", () => {
        const result = match("1234", "1234");
        expect(result).toEqual({ exact: 4, color: 0 });
    });
    it("matches colors", () => {
        const result = match("1234", "4321");
        expect(result).toEqual({ exact: 0, color: 4 });
    });
    it("combinations", () => {
        const result = match("1234", "1122");
        expect(result).toEqual({ exact: 1, color: 1 });
    });
});
