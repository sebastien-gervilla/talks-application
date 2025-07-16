// Librairies
import { useMemo, useState } from 'react';

// Application
import './create-conference-form.scss';
import { Form, FormHandler } from '@/modules/form';
import { talksService, TalksService } from '@/services/talks-service';
import { CONFERENCES_DAYS, getTimeFromSlot } from '@/constants/conferences';
import { useRequest } from '@/hooks';
import { Loader } from '@/components';

interface Props<T extends TalksService.Models.Conference.Create> {
    initialForm: T;
    onSubmit: (form: T) => void;
    onCancel: () => void;
}

const CreateConferenceForm = <T extends TalksService.Models.Conference.Create>({
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

    const availableSlotsRequest = useRequest({
        request: (controller) => talksService.conferences.getAvailableSlots(form.date, controller),
        dependencies: [form.date],
    });
    const availableSlots = availableSlotsRequest.response?.is(200)
        ? availableSlotsRequest.response.body
        : [];

    const availableRooms = useMemo(() => {
        return availableSlots.find(slot => slot.slot === form.slot)?.rooms || [];
    }, [availableSlots, form.slot]);

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
        <div className='form create-conference-form'>
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
            <div className="row">
                <Form.Select
                    label='Date'
                    name='date'
                    value={form.date}
                    onChange={handleChanges}
                    options={CONFERENCES_DAYS}
                    mapOption={(option) => ({
                        key: option.toISOString(),
                        value: option,
                        label: option.toDateString(),
                    })}
                />
            </div>
            <div className="row">
                <Form.Select
                    className='slot-select'
                    label='Horaire'
                    name='slot'
                    value={form.slot}
                    onChange={handleChanges}
                    options={availableSlots}
                    mapOption={(option) => ({
                        key: option.slot,
                        value: option.slot,
                        label: `${getTimeFromSlot(option.slot)}h`,
                    })}
                />
                <Form.Select
                    label='Salle'
                    name='room'
                    value={form.room}
                    onChange={handleChanges}
                    options={availableRooms}
                    mapOption={(option) => ({
                        key: option,
                        value: option,
                        label: option,
                    })}
                />
            </div>
            <div className="row">
                <Form.TextArea
                    label='Description'
                    name='description'
                    value={form.description}
                    onChange={handleChanges}
                    columns={3}
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

export default CreateConferenceForm;