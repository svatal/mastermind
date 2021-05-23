import {
    getColorGroups,
    generateAllSignificantWithRepetition,
} from "./generator";
import { match } from "./matcher";
import { getSuccessResult, IOptions } from "./settings";
import { IBestSplit } from "./solutionEnumerator";
import { Guess, MatchResult, createMatchResult, getCurrentPath } from "./utils";

export interface IState {
    size: number;
}

export interface IResultState extends IState {
    parent: IGuessState;
    result: MatchResult;
}

export function isResultState(s: IState): s is IResultState {
    const ownKey: keyof IResultState = "result";
    return ownKey in s;
}

interface IProcessedState extends IState {
    parent?: IGuessState;
    children: IState[];
}

export function isProcessedState(s: IState): s is IProcessedState {
    const ownKey: keyof IProcessedState = "children";
    return ownKey in s;
}

function enrichToProcessedState(
    s: IState,
    children: IResultState[]
): IProcessedState {
    const ps = s as IProcessedState;
    ps.children = children;
    return ps;
}

interface IGuessState extends IProcessedState {
    guess: Guess;
}

export function isGuessState(s: IState): s is IGuessState {
    const ownKey: keyof IGuessState = "guess";
    return ownKey in s;
}

function enrichToGuessState(
    s: IState,
    guess: Guess,
    children: IResultState[]
): IGuessState {
    const gs = s as IGuessState;
    gs.children = children;
    gs.guess = guess;
    return gs;
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
        const moves = isGuessState(s) ? 1 : 0;
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
    if (
        state.size === 1 &&
        isResultState(state) &&
        state.result === getSuccessResult(options)
    ) {
        const s = enrichToProcessedState(state, []);
        solveState(s, options);
        return s;
    }
    const statePath = getPath(state);
    const problemSpace = all.filter((g) =>
        statePath.every(
            (s) => createMatchResult(match(g, s.guess)) === s.result
        )
    );
    if (problemSpace.length === 1) {
        const s = enrichToGuessState(state, problemSpace[0], []);
        solveState(s, options);
        return s;
    }
    const colorGroups = getColorGroups(
        statePath.map((p) => p.guess),
        options.colorCount
    );
    const candidates = generateAllSignificantWithRepetition(
        options.positionCount,
        colorGroups
    );
    const split = getBestSplit(candidates, problemSpace);
    return enrichToGuessState(
        state,
        split.bestCandidate,
        Array.from(split.bestSplit.entries()).map<IResultState>(
            ([result, guesses]) => ({
                parent: state as IGuessState,
                result,
                size: guesses.length,
            })
        )
    );
}

function getPath(state: IState): { guess: Guess; result: MatchResult }[] {
    return isResultState(state)
        ? [
              ...getPath(state.parent),
              { guess: state.parent.guess, result: state.result },
          ]
        : [];
}
