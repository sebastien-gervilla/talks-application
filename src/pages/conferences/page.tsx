// Librairies
import { FC, JSX, useState } from 'react';

// Application
import './page.scss';
import { Modal, Page, Toast } from '@/components';
import { PrimaryLayout } from '@/layouts';
import { useAuthentication, useLocalStorage, useModal, useRequest, useToast } from '@/hooks';
import { TalksService, talksService } from '@/services/talks-service';
import { Form, FormHandler } from '@/modules/form';
import { Header } from '@/components/Header';
import { RouteSegment } from '@/application/router/types';
import { Plus, Users } from 'lucide-react';
import { ConferenceForm } from './components';
import { isSameDay } from '@/utils/date-utils';

const ConferencesPage: FC = () => {

    const [isReduced, setIsReduced] = useLocalStorage('is-sidebar-reduced', false);

    const handleToggleSidebar = () => setIsReduced(!isReduced);

    return (
        <Page id='conferences-page'>
            <PrimaryLayout isSidebarReduced={isReduced}>
                <Header
                    path={[{
                        to: `/${RouteSegment.Conferences}`,
                        title: 'Conférences',
                    }]}
                    toggleSidebar={handleToggleSidebar}
                />
                <Conferences />
            </PrimaryLayout>
        </Page>
    );
}

const Conferences: FC = () => {

    const { user, isAdministrator } = useAuthentication<'protected'>();

    const modal = useModal();
    const toast = useToast();

    const [filters, setFilters] = useState<TalksService.Models.Conference.GetQuery>({
        name: '',
    });

    const conferencesRequest = useRequest({
        request: (controller) => talksService.conferences.get(filters, controller),
    });
    const conferences = conferencesRequest.response?.is(200)
        ? conferencesRequest.response.body
        : [];

    const handleChanges: FormHandler<ValueOf<typeof filters>> = ({ name, value }) => {
        setFilters(current => ({
            ...current,
            [name]: value,
        }));
    }

    const handleNewConference = (date: Date, slot: number) => {
        modal.openWith(
            <ConferenceForm
                initialForm={{
                    name: '',
                    slot,
                    date,
                    speakerId: null!,
                    room: TalksService.Models.Conference.Room.RoomA,
                }}
                onSubmit={async (form) => { // [error-handling] - TODO: Error handling
                    const response = await talksService.conferences.create(form);
                    if (!response.is(204))
                        return toast.openDefaultFailure();

                    modal.close();
                    conferencesRequest.refresh();
                    toast.openDefaultSuccess();
                }}
                onCancel={modal.close}
            />
        );
    }

    const handleJoinConference = async (conference: TalksService.Models.Conference.Get) => {
        const response = await talksService.conferences.join(conference.id);
        if (!response.is(204))
            return toast.openDefaultFailure();

        conferencesRequest.refresh();
        toast.openDefaultSuccess();
    }

    const handleLeaveConference = async (conference: TalksService.Models.Conference.Get) => {
        const response = await talksService.conferences.leave(conference.id);
        if (!response.is(204))
            return toast.openDefaultFailure();

        conferencesRequest.refresh();
        toast.openDefaultSuccess();
    }

    const displayDays = () => {
        const displayed: JSX.Element[] = [];

        const daysConferences = getDaysConferences();

        for (const day of daysConferences) {
            displayed.push(
                <div
                    key={day.date.toISOString()}
                    className="day"
                >
                    {getDaySlots(day)}
                </div>
            );
        }

        return displayed;
    }

    const getDaySlots = (day: ConferencesByDate) => {
        const displayed: JSX.Element[] = [];

        for (let slot = START_SLOT; slot < MAX_SLOTS; slot++) {
            const conference = day.conferences.find(conference => conference.slot === slot);
            if (!conference)
                displayed.push(
                    <div
                        key={slot}
                        className={'slot empty' + (isAdministrator ? ' editable' : '')}
                        onClick={() => isAdministrator && handleNewConference(day.date, slot)}
                    >
                        {isAdministrator ? <Plus /> : 'Vide'}
                    </div>
                );
            else displayed.push(
                <div
                    key={slot}
                    className="slot conference"
                >
                    <div className="top">
                        <p className='name'>{conference.name}</p>
                    </div>
                    <p className='room'>Salle: {conference.room}</p>
                    <p className='room'>Horaire: {getTimeFromSlot(conference.slot)}h - {getTimeFromSlot(conference.slot) + 1}h</p>
                    <div className="bottom">
                        <div className="participants">
                            <Users />
                            <p>{conference.users.length}/{ROOM_MAX_USERS}</p>
                        </div>
                        {!conference.users.includes(user.id) ? (
                            <button
                                className='animated-link'
                                onClick={() => handleJoinConference(conference)}
                                disabled={conference.users.length >= ROOM_MAX_USERS}
                            >
                                Rejoindre
                            </button>
                        ) : (
                            <button
                                className='animated-link destructive'
                                onClick={() => handleLeaveConference(conference)}
                            >
                                Quitter
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return displayed;
    }

    const getDaysConferences = () => {
        const daysConferences = getDefaultDaysConferences();

        for (const conference of conferences) {
            const dayConferences = daysConferences.find((day) => isSameDay(day.date, conference.date));
            if (!dayConferences)
                continue;

            dayConferences.conferences.push(conference);
        }

        return daysConferences;
    }

    return (
        <div className="conferences-flow">
            <Modal {...modal} />
            <Toast {...toast} />
            <div className="header">
                <div className="filters">
                    <Form.Field
                        label='Nom'
                        name='name'
                        value={filters.name}
                        onChange={handleChanges}
                    />
                </div>
            </div>
            <div className="days">
                {displayDays()}
            </div>
        </div>
    );
}

type ConferencesByDate = {
    date: Date;
    conferences: TalksService.Models.Conference.Get[];
};

const getDefaultDaysConferences = (): ConferencesByDate[] => {
    const conferencesByDate: ConferencesByDate[] = [];
    for (const day of days) {
        conferencesByDate.push({
            date: day,
            conferences: [],
        });
    }
    return conferencesByDate;
}

const days = [
    new Date(2025, 5, 18),  // June 18, 2025
    new Date(2025, 5, 19),  // June 20, 2025
    new Date(2025, 5, 20),  // June 20, 2025
];

const START_SLOT = 1;
const MAX_SLOTS = 10;

const START_SLOT_HOUR = 8;

const ROOM_MAX_USERS = 25;

const getTimeFromSlot = (slot: number) => {
    return START_SLOT_HOUR + slot - 1;
}

export default ConferencesPage;