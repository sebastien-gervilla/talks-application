// Librairies
import { JSX, MouseEvent, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Custom
import './search-select.scss';
import { FormHandler } from '../form.types';
import { MapOptionFn, MappedOption, ValidOption } from './SearchSelect.types';
import { usePopover } from '@/hooks';
import { Popover } from '@/components';

interface Props<Value, Option extends ValidOption> {
    label?: string;
    name: string;
    value: Value | null;
    onChange: FormHandler<Value>;
    options: readonly Option[];
    mapOption: MapOptionFn<Value, Option>;
    isOptionSelected?: (option: MappedOption<Value>, value: Value) => boolean,
}

const SearchSelect = <Value, Option extends ValidOption>({
    label,
    name,
    value,
    onChange,
    options = [],
    mapOption,
    isOptionSelected,
}: Props<Value, Option>) => {

    const popover = usePopover();

    const mappedOptions = useMemo(() => options.map(mapOption) || [], [options]);

    const selectRef = useRef<HTMLDivElement | null>(null);

    const [search, setSearch] = useState(getPlaceholder(value));

    const handleOpenOptions = () => {
        if (!selectRef.current)
            return;

        if (popover.isOpened)
            return;

        setSearch('');

        popover.openFrom(selectRef.current, null);
    }

    const handleChange = (event: MouseEvent<HTMLDivElement>, value: Value) => {
        onChange({
            name,
            value,
            base: event
        });

        popover.close();
        setSearch(getPlaceholder(value));
    }

    const getOptions = () => {
        if (!options.length)
            return <EmptyOption />

        let displayedOptions: JSX.Element[] = [];
        for (const mappedOption of mappedOptions) {
            if (!mappedOption.label.toLowerCase().includes(search.toLowerCase()))
                continue;

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

        return displayedOptions.length
            ? displayedOptions
            : <EmptyOption />;
    }

    function getPlaceholder(value: Value | null) {
        if (!value)
            return '';

        const selectedOption = mappedOptions.find(mappedOption => (
            value && isOptionSelected
                ? isOptionSelected(mappedOption, value)
                : mappedOption.value === value
        ));

        return selectedOption
            ? selectedOption.label
            : '';
    }

    return (
        <div className="form-field search-select">
            {!!label && (
                <label>
                    {label}
                </label>
            )}
            <div
                ref={selectRef}
                className="select-button"
                onClick={handleOpenOptions}
            >
                <input
                    name='search'
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                    onFocus={handleOpenOptions}
                    autoComplete='off'
                />
                <ChevronDown size={20} strokeWidth={1.25} />
            </div>
            <Popover
                {...popover}
                body={(
                    <div
                        className="search-select-options"
                        style={{ width: selectRef.current?.getBoundingClientRect().width }}
                    >
                        {getOptions()}
                    </div>
                )}
                position={{
                    anchorOrigin: {
                        horizontal: 'left',
                        vertical: 'bottom',
                    },
                    bodyOrigin: {
                        horizontal: 'left',
                        vertical: 'top',
                    },
                    gap: {
                        horizontal: 0,
                        vertical: 8
                    }
                }}
                getClickOutsideExceptions={(popoverRef) => [popoverRef, selectRef]}
                onClose={() => {
                    popover.close();
                    setSearch(getPlaceholder(value));
                }}
            />
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

export default SearchSelect;