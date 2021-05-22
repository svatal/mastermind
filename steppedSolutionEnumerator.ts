import {
    getColorGroups,
    generateAllSignificantWithRepetition,
} from "./generator";
import { match } from "./matcher";
import { getSuccessResult, IOptions } from "./settings";
import { IBestSplit } from "./solutionEnumerator";
import { Guess, MatchResult, createMatchResult, getCurrentPath } from "./utils";

export interface IState {
    children?: IState[];
    size: number;
}

export interface IGuessState extends IState {
    parent: IProcessedState;
    guess: Guess;
    result: MatchResult;
}

export function isGuessState(s: IState): s is IGuessState {
    const ownKey: keyof IGuessState = "guess";
    return ownKey in s;
}

interface IProcessedState extends IState {
    parent?: IProcessedState;
    children: IState[];
}

function enrichToProcessedState(
    s: IState,
    children: IGuessState[]
): IProcessedState {
    s.children = children;
    return s as IProcessedState;
}

export interface ISolvedState extends IProcessedState {
    max: number;
    avg: number;
}

export function isSolvedState(s: IState): s is ISolvedState {
    const ownKey: keyof ISolvedState = "max";
    return ownKey in s;
}

function solveState(s: IProcessedState, options: IOptions) {
    const solvedChildren = s.children.filter(isSolvedState);
    if (s.children.length !== solvedChildren.length) return;
    if (solvedChildren.length === 0) {
        const moves =
            isGuessState(s) && s.result === getSuccessResult(options) ? 0 : 1;
        enrichToSolvedState(s, moves, moves);
    } else {
        enrichToSolvedState(
            s,
            Math.max(...solvedChildren.map((c) => c.max)) + 1,
            solvedChildren.reduce((p, c) => p + c.avg * c.size, 0) / s.size + 1
        );
    }
    if (s.parent) solveState(s.parent, options);
}

function enrichToSolvedState(s: IProcessedState, max: number, avg: number) {
    const ns = s as ISolvedState;
    ns.max = max;
    ns.avg = avg;
}

export function step(
    all: Guess[],
    options: IOptions,
    getBestSplit: (candidates: Guess[], problemSpace: Guess[]) => IBestSplit,
    state: IState
): IProcessedState {
    if (state.size === 1) {
        const s = enrichToProcessedState(state, []);
        solveState(s, options);
        return s;
    }
    const statePath = getStatePath(state);
    const problemSpace = all.filter((g) =>
        statePath.every(
            (s) => createMatchResult(match(g, s.guess)) === s.result
        )
    );
    const colorGroups = getColorGroups(
        statePath.map((p) => p.guess),
        options.colorCount
    );
    const candidates = generateAllSignificantWithRepetition(
        options.positionCount,
        colorGroups
    );
    const split = getBestSplit(candidates, problemSpace);
    return enrichToProcessedState(
        state,
        Array.from(split.bestSplit.entries()).map<IGuessState>(
            ([result, guesses]) => ({
                parent: state as IProcessedState,
                guess: split.bestCandidate,
                result,
                size: guesses.length,
            })
        )
    );
}

function getStatePath(state: IState): IGuessState[] {
    return isGuessState(state) ? [...getStatePath(state.parent), state] : [];
}
