// Libraries
import { FC, ChangeEvent, ReactNode, HTMLInputTypeAttribute, KeyboardEventHandler } from 'react';

// Application
import './field.scss';
import { FormHandler } from '../form.types';

interface Props {
    label?: string;
    name: string;
    value: string;
    onChange: FormHandler<string, ChangeEvent<HTMLInputElement>>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    className?: string;
    startElement?: ReactNode;
    endElement?: ReactNode;
}

const FormField: FC<Props> = ({
    label,
    name,
    value,
    onChange,
    onKeyDown,
    placeholder,
    type,
    className,
    startElement,
    endElement,
}) => {

    const handleChanges = (event: ChangeEvent<HTMLInputElement>) => {
        onChange({
            name,
            value: event.target.value,
            base: event,
        });
    }

    return (
        <div className={'form-field text-field' + (className ? ` ${className}` : '')}>
            {(label && (
                <label htmlFor={name}>
                    {label}
                </label>
            ))}
            <div className="input">
                {startElement}
                <input
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChanges}
                    onKeyDown={onKeyDown}
                    type={type}
                    placeholder={placeholder}
                />
                {endElement}
            </div>
        </div>
    );
};

export default FormField;