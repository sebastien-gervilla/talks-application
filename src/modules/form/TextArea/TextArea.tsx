// Librairies
import { ChangeEvent, FC, ReactNode } from 'react';

// Application
import './text-area.scss';
import { FormHandler } from '../form.types';

interface Props {
    label?: string;
    name: string;
    value: string;
    onChange: FormHandler<string, ChangeEvent<HTMLTextAreaElement>>;
    columns: number;
    placeholder?: string;
    className?: string;
    startElement?: ReactNode;
    endElement?: ReactNode;
}

const TextArea: FC<Props> = ({
    label,
    name,
    value,
    onChange,
    columns,
    placeholder,
    className,
    startElement,
    endElement,
}) => {

    const handleChanges = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange({
            name,
            value: event.target.value,
            base: event,
        });
    }

    return (
        <div className={'form-field text-field textarea-field' + (className ? ` ${className}` : '')}>
            {(label && (
                <label htmlFor={name}>
                    {label}
                </label>
            ))}
            <div className="input">
                {startElement}
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChanges}
                    placeholder={placeholder}
                    cols={columns}
                />
                {endElement}
            </div>
        </div>
    );
}

export default TextArea;