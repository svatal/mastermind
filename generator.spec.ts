import { generateAll } from "./generator";

describe("generator", () => {
    describe("with repetition", () => {
        it("can generate 2x2 matrix", () => {
            const result = generateAll({
                colors: 2,
                positions: 2,
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
                colors: 2,
                positions: 3,
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
                colors: 3,
                positions: 3,
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
                colors: 2,
                positions: 2,
                repetition: false,
            });
            expect(result).toEqual(["12", "21"]);
        });
        it("can generate 3x2 matrix", () => {
            const result = generateAll({
                colors: 3,
                positions: 2,
                repetition: false,
            });
            expect(result).toEqual(["12", "13", "21", "23", "31", "32"]);
        });
        it("can generate 3x3 matrix", () => {
            const result = generateAll({
                colors: 3,
                positions: 3,
                repetition: false,
            });
            expect(result).toEqual(["123", "132", "213", "231", "312", "321"]);
        });
    });
});
