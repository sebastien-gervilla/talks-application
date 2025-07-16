// Librairies
import { JSX, MouseEvent, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Custom
import './select.scss';
import { FormHandler } from '../form.types';
import { MapOptionFn, MappedOption, ValidOption } from './Select.types';
import { Options } from './Options';

interface Props<Value, Option extends ValidOption> {
    label?: string;
    name: string;
    value: Value | null;
    onChange: FormHandler<Value>;
    options: readonly Option[];
    mapOption: MapOptionFn<Value, Option>;
    isOptionSelected?: (option: MappedOption<Value>, value: Value) => boolean;
    className?: string;
}

const Select = <Value, Option extends ValidOption>({
    label,
    name,
    value,
    onChange,
    options = [],
    mapOption,
    isOptionSelected,
    className,
}: Props<Value, Option>) => {

    const mappedOptions = useMemo(() => options.map(mapOption) || [], [options]);

    const selectRef = useRef<HTMLDivElement | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    const handleToggleIsSelecting = () => setIsSelecting(prev => !prev);

    const handleChange = (event: MouseEvent<HTMLDivElement>, value: Value) => {
        onChange({
            name,
            value,
            base: event
        });
    }

    const getPlaceholder = () => {
        const selectedOption = mappedOptions.find(mappedOption => (
            value && isOptionSelected
                ? isOptionSelected(mappedOption, value)
                : mappedOption.value === value
        ));

        return selectedOption
            ? selectedOption.label
            : null;
    }

    const getOptions = () => {
        if (!options.length)
            return <EmptyOption />

        let displayedOptions: JSX.Element[] = [];
        for (const mappedOption of mappedOptions) {
            const isSelected = value && isOptionSelected
                ? isOptionSelected(mappedOption, value)
                : mappedOption.value === value;

            displayedOptions.push(
                <div
                    key={mappedOption.key}
                    className={'option' + (isSelected ? ' selected' : '')}
                    onClick={(event) => !isSelected && handleChange(event, mappedOption.value)}
                >
                    {mappedOption.label}
                </div>
            )
        }

        return displayedOptions;
    }

    return (
        <div className={'form-field select' + (className ? ` ${className}` : '')}>
            {!!label && (
                <label>
                    {label}
                </label>
            )}
            <div
                ref={selectRef}
                className="select-button"
                onClick={() => setIsSelecting(!isSelecting)}
            >
                <p>{getPlaceholder()}</p>
                <button
                    type='button'
                    className='select-icon-button'
                >
                    <ChevronDown size={20} strokeWidth={1.25} />
                </button>
                {(isSelecting && selectRef.current) &&
                    <Options
                        anchor={selectRef.current}
                        options={getOptions()}
                        onOptionClick={handleToggleIsSelecting}
                    />
                }
            </div>
        </div>
    );
}

const EmptyOption = () => {
    return (
        <div className='empty-option'>
            Aucune option
        </div>
    );
}

export default Select;