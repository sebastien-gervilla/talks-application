// Librairies
import { MouseEvent, useMemo } from 'react';

// Application
import './tab-select.scss';
import { FormHandler } from '../form.types';
import { MapOptionFn, ValidOption } from '../Select/Select.types';

interface Props<Value, Option extends ValidOption> {
    label?: string;
    name: string;
    value: Value;
    onChange: FormHandler<Value, MouseEvent<HTMLDivElement>>;
    options: Option[];
    mapOption: MapOptionFn<Value, Option>;
}

const TabSelect = <Value, Option extends ValidOption>({
    label,
    name,
    value,
    onChange,
    options,
    mapOption
}: Props<Value, Option>) => {

    const mappedOptions = useMemo(() => options.map(mapOption) || [], [options]);

    const handleChange = (event: MouseEvent<HTMLDivElement>, value: Value) => {
        onChange({
            name,
            value,
            base: event
        });
    }

    const displayOptions = () => {
        if (!options.length) return (
            <div className="option empty">
                Aucune option
            </div>
        );

        return mappedOptions.map(option => (
            <div
                key={option.key}
                className={'option' + (option.value === value ? ' selected' : '')}
                onClick={(event) => handleChange(event, option.value)}
            >
                <p>{option.label}</p>
            </div>
        ));
    }

    return (
        <div className='form-field tab-select-field'>
            <label>
                {label}
            </label>
            <div className="tab-select">
                {displayOptions()}
            </div>
        </div>
    );
}

export default TabSelect;