// Librairies
import { FC, MouseEvent } from 'react';
import { Check } from 'lucide-react';

// Application
import './checkbox.scss';
import { FormHandler } from '../form.types';

interface Props {
    id?: string;
    name: string;
    value: boolean;
    onChange: FormHandler<boolean, MouseEvent<HTMLButtonElement>>;
}

const Checkbox: FC<Props> = ({ id, name, value, onChange }) => {

    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        onChange({
            name,
            value: !value,
            base: event,
        });
    }

    return (
        <button
            id={id}
            role='checkbox'
            className='checkbox'
            onClick={handleToggle}
            aria-checked={value ? 'true' : 'false'}
            data-state={value ? 'checked' : 'unchecked'}
        >
            {value ? <Check size={16} /> : null}
        </button>
    );
}

export default Checkbox;