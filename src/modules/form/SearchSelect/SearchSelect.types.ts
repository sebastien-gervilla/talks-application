import { Key } from 'react';

export interface MappedOption<Value> {
    key: Key;
    value: Value;
    label: string;
}

type ObjectOption = {
    [key: string]: any;
};

export type ValidOption = string | ObjectOption;
export type MapOptionFn<Value, Option extends ValidOption> = (option: Option) => MappedOption<Value>;