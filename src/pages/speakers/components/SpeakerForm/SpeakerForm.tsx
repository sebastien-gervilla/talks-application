// Librairies
import { useState } from 'react';

// Application
import { Form, FormHandler } from '@/modules/form';
import { TalksService } from '@/services/talks-service';

interface Props<T extends TalksService.Models.Speaker.Create> {
    initialForm: T;
    onSubmit: (form: T) => void;
    onCancel: () => void;
}

const SpeakerForm = <T extends TalksService.Models.Speaker.Create>({
    initialForm,
    onSubmit,
    onCancel,
}: Props<T>) => {

    const [form, setForm] = useState(initialForm);

    const handleChanges: FormHandler<ValueOf<TalksService.Models.Speaker.Create>> = ({ name, value }) => {
        setForm(current => ({
            ...current,
            [name]: value,
        }));
    }

    const handleSubmit = () => onSubmit(form);

    return (
        <div className='form speaker-form'>
            <h3>Conférencier</h3>
            <div className="row">
                <Form.Field
                    label='Prénom'
                    name='firstName'
                    value={form.firstName}
                    onChange={handleChanges}
                />
                <Form.Field
                    label='Nom'
                    name='lastName'
                    value={form.lastName}
                    onChange={handleChanges}
                />
            </div>
            <div className="row">
                <Form.TextArea
                    label='Biographie'
                    name='biography'
                    value={form.biography}
                    onChange={handleChanges}
                    columns={5}
                />
            </div>
            <div className="row footer">
                <button
                    className='animated text ghost'
                    onClick={onCancel}
                >
                    Annuler
                </button>
                <button
                    className='animated'
                    onClick={handleSubmit}
                >
                    Valider
                </button>
            </div>
        </div>
    );
}

export default SpeakerForm;