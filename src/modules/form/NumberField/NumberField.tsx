// Librairies
import { ChangeEvent, FC, ReactElement } from 'react';

// Application
import { FormHandler } from '../form.types';

interface Props {
    label?: string;
    name: string;
    value: number;
    onChange: FormHandler<number, ChangeEvent<HTMLInputElement>>
    className?: string;
    startElement?: ReactElement;
    endElement?: ReactElement;
}

const NumberField: FC<Props> = ({ label, name, value, onChange, className, startElement, endElement }) => {

    const handleChanges = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value)
            return onChange({
                name,
                value: 0,
                base: event,
            });

        const numericValue = parseInt(event.target.value);
        if (isNaN(numericValue))
            return;

        onChange({
            name,
            value: numericValue,
            base: event,
        });
    }

    return (
        <div className={'form-field number-field text-field' + (className ? ` ${className}` : '')}>
            {!!label && (
                <label>
                    {label}
                </label>
            )}
            <div className="input">
                {startElement}
                <input
                    id={name}
                    name={name}
                    value={value || ''}
                    onChange={handleChanges}
                    type='number'
                />
                {endElement}
            </div>
        </div>
    );
}

export default NumberField;