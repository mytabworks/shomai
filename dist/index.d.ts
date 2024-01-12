export type FlattenObject<TRecord> = CollapseEntries<CreateObjectEntries<TRecord, TRecord>>;
type Entry = {
    key: string;
    value: unknown;
};
type EmptyEntry<TValue> = {
    key: '';
    value: TValue;
};
type ExcludedTypes = Date | Set<unknown> | Map<unknown, unknown>;
type ArrayEncoder = `[${bigint}]`;
type EscapeArrayKey<TKey extends string> = TKey extends `${infer TKeyBefore}.${ArrayEncoder}${infer TKeyAfter}` ? EscapeArrayKey<`${TKeyBefore}${ArrayEncoder}${TKeyAfter}`> : TKey;
type CollapseEntries<TEntry extends Entry> = {
    [E in TEntry as EscapeArrayKey<E['key']>]: E['value'];
};
type CreateArrayEntry<TValue, TValueInitial> = OmitItself<TValue extends unknown[] ? {
    [k: ArrayEncoder]: TValue[number];
} : TValue, TValueInitial>;
type OmitItself<TValue, TValueInitial> = TValue extends TValueInitial ? EmptyEntry<TValue> : OmitExcludedTypes<TValue, TValueInitial>;
type OmitExcludedTypes<TValue, TValueInitial> = TValue extends ExcludedTypes ? EmptyEntry<TValue> : CreateObjectEntries<TValue, TValueInitial>;
type CreateObjectEntries<TRecord, TRecordInitial> = TRecord extends object ? {
    [TKey in keyof TRecord]-?: TKey extends string ? CreateArrayEntry<TRecord[TKey], TRecordInitial> extends infer TNestedValue ? TNestedValue extends Entry ? TNestedValue['key'] extends '' ? {
        key: TKey;
        value: TNestedValue['value'];
    } : {
        key: `${TKey}.${TNestedValue['key']}`;
        value: TNestedValue['value'];
    } | {
        key: TKey;
        value: TRecord[TKey];
    } : never : never : never;
}[keyof TRecord] : EmptyEntry<TRecord>;
type Narrowable = string | number | bigint | boolean;
export type Narrow<T> = (T extends Narrowable ? T : never) | {
    [K in keyof T]: Narrow<T[K]>;
};
export const createStore: <P = Record<string, any>>(initialState: P, onChange?: (state: P) => void) => {
    getState: () => P;
    setState: (fn: (state: P) => P) => void;
    getServerSideState: () => P;
    initializeServerSideState: (initialServerSideState: P) => void;
    subscribe: (listener: () => void) => () => boolean;
};
export const useStore: <P = Record<string, any>, S = any>(store: {
    getState: () => P;
    setState: (fn: (state: P) => P) => void;
    getServerSideState: () => P;
    initializeServerSideState: (initialServerSideState: P) => void;
    subscribe: (listener: () => void) => () => boolean;
}, selector: (state: P) => S) => S;
export const useStoreSelectorState: <P = Record<string, any>, K extends keyof FlattenObject<P> = keyof FlattenObject<P>, S = FlattenObject<P>[K]>(store: {
    getState: () => P;
    setState: (fn: (state: P) => P) => void;
    getServerSideState: () => P;
    initializeServerSideState: (initialServerSideState: P) => void;
    subscribe: (listener: () => void) => () => boolean;
}, selector: K) => [S, (callback: S | ((state: S) => S)) => void];

//# sourceMappingURL=index.d.ts.map
