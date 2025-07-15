// Librairies
import { useState } from 'react';

// Application
import { Form, FormHandler } from '@/modules/form';
import { talksService, TalksService } from '@/services/talks-service';
import { rooms } from '@/constants/conferences';
import { useRequest } from '@/hooks';
import { Loader } from '@/components';

interface Props<T extends TalksService.Models.Conference.Create> {
    initialForm: T;
    onSubmit: (form: T) => void;
    onCancel: () => void;
}

const ConferenceForm = <T extends TalksService.Models.Conference.Create>({
    initialForm,
    onSubmit,
    onCancel,
}: Props<T>) => {

    const speakersRequest = useRequest({
        request: talksService.speakers.get,
    });
    const speakers = speakersRequest.response?.is(200)
        ? speakersRequest.response.body
        : [];

    const [form, setForm] = useState(initialForm);

    const handleChanges: FormHandler<ValueOf<TalksService.Models.Conference.Create>> = ({ name, value }) => {
        setForm(current => ({
            ...current,
            [name]: value,
        }));
    }

    const handleSubmit = () => onSubmit(form);

    if (speakersRequest.isLoading)
        return <Loader />

    return (
        <div className='form conference-form'>
            <h3>Conférence</h3>
            <div className="row" style={{ width: 300 }}>
                <Form.Field
                    label='Nom'
                    name='name'
                    value={form.name}
                    onChange={handleChanges}
                />
            </div>
            <div className="row">
                <Form.Select
                    label='Salle'
                    name='room'
                    value={form.room}
                    onChange={handleChanges}
                    options={rooms}
                    mapOption={(option) => ({
                        key: option,
                        value: option,
                        label: option,
                    })}
                />
            </div>
            <div className="row">
                <Form.Select
                    label='Conférencier'
                    name='speakerId'
                    value={form.speakerId}
                    onChange={handleChanges}
                    options={speakers}
                    mapOption={(option) => ({
                        key: option.id,
                        value: option.id,
                        label: `${option.firstName} ${option.lastName}`,
                    })}
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

export default ConferenceForm;