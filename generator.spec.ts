import {
    generateAll,
    generateAllSignificantWithRepetition,
    getColorGroups,
} from "./generator";

describe("generator", () => {
    describe("with repetition", () => {
        it("can generate 2x2 matrix", () => {
            const result = generateAll({
                colorCount: 2,
                positionCount: 2,
                repetition: true,
            });
            // prettier-ignore
            expect(result).toEqual([
                "11", "12",
                "21", "22",
            ])
        });
        it("can generate 2x3 matrix", () => {
            const result = generateAll({
                colorCount: 2,
                positionCount: 3,
                repetition: true,
            });
            // prettier-ignore
            expect(result).toEqual([
                "111", "112",
                "121", "122",
                "211", "212", 
                "221", "222", 
            ])
        });
        it("can generate 3x3 matrix", () => {
            const result = generateAll({
                colorCount: 3,
                positionCount: 3,
                repetition: true,
            });
            // prettier-ignore
            expect(result).toEqual([
                "111", "112", "113",
                "121", "122", "123",
                "131", "132", "133",
                "211", "212", "213",
                "221", "222", "223",
                "231", "232", "233",
                "311", "312", "313",
                "321", "322", "323",
                "331", "332", "333",
            ])
        });
    });
    describe("without repetition", () => {
        it("can generate 2x2 matrix", () => {
            const result = generateAll({
                colorCount: 2,
                positionCount: 2,
                repetition: false,
            });
            expect(result).toEqual(["12", "21"]);
        });
        it("can generate 3x2 matrix", () => {
            const result = generateAll({
                colorCount: 3,
                positionCount: 2,
                repetition: false,
            });
            expect(result).toEqual(["12", "13", "21", "23", "31", "32"]);
        });
        it("can generate 3x3 matrix", () => {
            const result = generateAll({
                colorCount: 3,
                positionCount: 3,
                repetition: false,
            });
            expect(result).toEqual(["123", "132", "213", "231", "312", "321"]);
        });
    });
});

describe("getColorGroups", () => {
    it("at start keeps all colors in same group", () => {
        const result = getColorGroups([], 4);
        expect(result).toEqual([["1", "2", "3", "4"]]);
    });
    it("after first try splits into used and not used", () => {
        const result = getColorGroups(["12"], 4);
        expect(result).toEqual([
            ["1", "2"],
            ["3", "4"],
        ]);
    });
    it("after second try splits into used by tries", () => {
        const result = getColorGroups(["123", "124"], 5);
        expect(result).toEqual([["1", "2"], ["3"], ["4"], ["5"]]);
    });
});

describe("generateAllSignificantWithRepetition", () => {
    it("does not uses other colors from group until previous one has been used", () => {
        const result = generateAllSignificantWithRepetition(2, [
            ["1", "2", "4"],
            ["3"],
        ]);
        expect(result).toEqual(["11", "12", "13", "31", "33"]);
    });
});
