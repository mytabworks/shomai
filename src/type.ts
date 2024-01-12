export type FlattenObject<TRecord> = CollapseEntries<CreateObjectEntries<TRecord, TRecord>>;

type Entry = { key: string; value: unknown };
type EmptyEntry<TValue> = { key: ''; value: TValue };
type ExcludedTypes = Date | Set<unknown> | Map<unknown, unknown>;
type ArrayEncoder = `[${bigint}]`;

type EscapeArrayKey<TKey extends string> = TKey extends `${infer TKeyBefore}.${ArrayEncoder}${infer TKeyAfter}`
    ? EscapeArrayKey<`${TKeyBefore}${ArrayEncoder}${TKeyAfter}`>
    : TKey;

// Transforms entries to one flattened type
type CollapseEntries<TEntry extends Entry> = {
    [E in TEntry as EscapeArrayKey<E['key']>]: E['value'];
};

// Transforms array type to object
type CreateArrayEntry<TValue, TValueInitial> = OmitItself<
    TValue extends unknown[] ? { [k: ArrayEncoder]: TValue[number] } : TValue,
    TValueInitial
>;

// Omit the type that references itself
type OmitItself<TValue, TValueInitial> = TValue extends TValueInitial
    ? EmptyEntry<TValue>
    : OmitExcludedTypes<TValue, TValueInitial>;

// Omit the type that is listed in ExcludedTypes union
type OmitExcludedTypes<TValue, TValueInitial> = TValue extends ExcludedTypes
    ? EmptyEntry<TValue>
    : CreateObjectEntries<TValue, TValueInitial>;

type CreateObjectEntries<TRecord, TRecordInitial> = TRecord extends object
    ? {
        // Checks that Key is of type string
        [TKey in keyof TRecord]-?: 
            TKey extends string
            ? // Nested key can be an object, run recursively to the bottom
                CreateArrayEntry<TRecord[TKey], TRecordInitial> extends infer TNestedValue
                ? TNestedValue extends Entry
                    ? TNestedValue['key'] extends ''
                        ? {
                            key: TKey;
                            value: TNestedValue['value'];
                        }
                        : | {
                                key: `${TKey}.${TNestedValue['key']}`;
                                value: TNestedValue['value'];
                            }
                          | {
                                key: TKey;
                                value: TRecord[TKey];
                            }  
                    : never
                : never
            : never;
        }[keyof TRecord] // Builds entry for each key
    : EmptyEntry<TRecord>;

// Narrow utility

type Narrowable = string | number | bigint | boolean;
export type Narrow<T> =
    | (T extends Narrowable ? T : never)
    | {
        [K in keyof T]: Narrow<T[K]>;
        };