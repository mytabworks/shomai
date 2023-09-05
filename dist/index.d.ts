export const createStore: <P = any>(initialState: P) => {
    getState: () => P;
    setState: (fn: (state: P) => P) => void;
    getServerSideState: () => P;
    initializeServerSideState: (initialServerSideState: P) => void;
    subscribe: (listener: () => void) => () => any;
};
export const useStore: <S = any, P = any>(store: {
    getState: () => P;
    setState: (fn: (state: P) => P) => void;
    getServerSideState: () => P;
    initializeServerSideState: (initialServerSideState: P) => void;
    subscribe: (listener: () => void) => () => any;
}, selector: (state: P) => S) => S;
export const useStoreSelectorState: <S = any, P = any>(store: {
    getState: () => P;
    setState: (fn: (state: P) => P) => void;
    getServerSideState: () => P;
    initializeServerSideState: (initialServerSideState: P) => void;
    subscribe: (listener: () => void) => () => any;
}, selector: string) => [S, (callback: S | ((state: S) => S)) => void];

//# sourceMappingURL=index.d.ts.map
