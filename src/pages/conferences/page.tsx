// Librairies
import { FC, JSX, useState } from 'react';

// Application
import './page.scss';
import { Confirmation, Modal, Page, Toast } from '@/components';
import { PrimaryLayout } from '@/layouts';
import { useAuthentication, useLocalStorage, useModal, useRequest, useToast } from '@/hooks';
import { TalksService, talksService } from '@/services/talks-service';
import { Form, FormHandler } from '@/modules/form';
import { Header } from '@/components/Header';
import { RouteSegment } from '@/application/router/types';
import { Calendar, ListFilter, PenLine, Plus, Users, X } from 'lucide-react';
import { ConferenceForm, CreateConferenceForm } from './components';
import { isSameDay } from '@/utils/date-utils';
import { CONFERENCES_DAYS, getTimeFromSlot, MAX_SLOTS, ROOM_MAX_USERS, rooms, START_SLOT } from '@/constants/conferences';

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

    const [view, setView] = useState<View>(isAdministrator ? 'schedule' : 'filtered');

    const [filters, setFilters] = useState<TalksService.Models.Conference.GetQuery>({
        ...defaultFilters,
        room: isAdministrator
            ? rooms[0]
            : undefined,
    });

    const conferencesRequest = useRequest({
        request: (controller) => talksService.conferences.get(filters, controller),
        dependencies: [filters],
    });
    const conferences = conferencesRequest.response?.is(200)
        ? conferencesRequest.response.body
        : [];

    const speakersRequest = useRequest({
        request: talksService.speakers.get,
    });
    const speakers = speakersRequest.response?.is(200)
        ? speakersRequest.response.body
        : [];

    const handleChangeView = (newView: View) => {
        if (newView === 'schedule') {
            setFilters({
                ...defaultFilters,
                room: rooms[0],
            });
        } else {
            setFilters(defaultFilters);
        }

        setView(newView);
    }

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
                    description: '',
                    slot,
                    date,
                    speakerId: null!,
                    room: filters.room || rooms[0],
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

    const handleCreateConference = () => {
        modal.openWith(
            <CreateConferenceForm
                initialForm={{
                    name: '',
                    description: '',
                    slot: 1,
                    date: CONFERENCES_DAYS[0],
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

    const handleUpdateConference = (conference: TalksService.Models.Conference.Get) => {
        const { speaker, ...rest } = conference;

        modal.openWith(
            <ConferenceForm
                initialForm={{
                    ...rest,
                    speakerId: conference.id
                }}
                onSubmit={async (form) => { // [error-handling] - TODO: Error handling
                    const response = await talksService.conferences.update(conference.id, form);
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

    const handleDeleteConference = (speaker: TalksService.Models.Conference.Get) => {
        modal.openWith(
            <Confirmation
                onValidate={async () => { // [error-handling] - TODO: Error handling
                    const response = await talksService.conferences.delete(speaker.id);
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

    // Filtered

    const getConferences = () => {
        const displayed: JSX.Element[] = [];

        for (const conference of conferences)
            displayed.push(getSlot(conference));

        return displayed;
    }

    // Schedule view

    const displayDays = () => {
        const displayed: JSX.Element[] = [];

        const daysConferences = getDaysConferences();

        for (const day of daysConferences) {
            displayed.push(
                <div
                    key={day.date.toISOString()}
                    className="day"
                >
                    <p>{day.date.toLocaleDateString()}</p>
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
                displayed.push(getEmptySlot(slot, () => isAdministrator && handleNewConference(day.date, slot)));
            else
                displayed.push(getSlot(conference));
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

    // Global rendering

    const getSlot = (conference: TalksService.Models.Conference.Get) => {
        return (
            <div
                key={`${conference.id}-${conference.slot}`}
                className="slot conference"
            >
                <div className="top">
                    <p className='name'>{conference.name}</p>
                    {isAdministrator && (
                        <div className="actions">
                            <button
                                className='icon-button'
                                onClick={() => handleUpdateConference(conference)}
                            >
                                <PenLine />
                            </button>
                            <button
                                className='icon-button destructive'
                                onClick={() => handleDeleteConference(conference)}
                            >
                                <X />
                            </button>
                        </div>
                    )}
                </div>
                <p className='room'><span>Salle</span> : {conference.room}</p>
                <p className='schedule'><span>Horaire</span> : {getTimeFromSlot(conference.slot)}h - {getTimeFromSlot(conference.slot) + 1}h</p>
                <p className='description'><span>Description</span> : {conference.description}</p>
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

    const getEmptySlot = (key: string | number, onClick: () => void) => {
        return (
            <div
                key={key}
                className={'slot empty' + (isAdministrator ? ' editable' : '')}
                onClick={onClick}
            >
                {isAdministrator ? <Plus /> : 'Vide'}
            </div>
        );
    }

    const getSpeakersOptions = () => {
        let options = speakers.map(speaker => ({
            key: speaker.id,
            value: speaker.id,
            label: `${speaker.firstName} ${speaker.lastName}`,
        }));

        return [{
            key: 'all',
            value: undefined,
            label: 'Tous',
        }, ...options];
    }

    const getRoomsOptions = () => {
        let options = rooms.map(room => ({
            key: room,
            value: room,
            label: room,
        }));

        return [{
            key: 'all',
            value: undefined,
            label: 'Tous',
        }, ...options];
    }

    return (
        <div className="conferences-flow">
            <Modal {...modal} />
            <Toast {...toast} />
            <div className="header">
                {view === 'schedule' ? (
                    <div className="filters">
                        <Form.Select
                            label='Salle'
                            name='room'
                            value={filters.room}
                            onChange={handleChanges}
                            options={rooms}
                            mapOption={(option) => ({
                                key: option,
                                value: option,
                                label: option,
                            })}
                        />
                    </div>
                ) : (
                    <div className="filters">
                        <Form.Field
                            label='Nom'
                            name='name'
                            value={filters.name}
                            onChange={handleChanges}
                        />
                        <Form.Select
                            label='Salle'
                            name='room'
                            value={filters.room}
                            onChange={handleChanges}
                            options={getRoomsOptions()}
                            mapOption={(option) => ({
                                key: option.key,
                                value: option.value,
                                label: option.label,
                            })}
                        />
                        <Form.Select
                            label='Conférencier'
                            name='speakerId'
                            value={filters.speakerId}
                            onChange={handleChanges}
                            options={getSpeakersOptions()}
                            mapOption={(option) => ({
                                key: option.key,
                                value: option.value,
                                label: option.label,
                            })}
                        />
                        <Form.Select
                            label='Date'
                            name='date'
                            value={filters.date}
                            onChange={handleChanges}
                            options={getDateFilterOptions()}
                            mapOption={(option) => ({
                                key: option.key,
                                value: option.value,
                                label: option.label,
                            })}
                        />
                    </div>
                )}
                <div className="view-selector">
                    <button
                        className={'tab' + (view === 'filtered' ? ' selected' : '')}
                        onClick={() => handleChangeView('filtered')}
                    >
                        <ListFilter />
                        Filtres
                    </button>
                    <button
                        className={'tab' + (view === 'schedule' ? ' selected' : '')}
                        onClick={() => handleChangeView('schedule')}
                    >
                        <Calendar />
                        Calendrier
                    </button>
                </div>
            </div>
            {view === 'schedule' ? (
                <div className="days">
                    {displayDays()}
                </div>
            ) : (
                <div className="conferences">
                    {getEmptySlot('empty-slot', handleCreateConference)}
                    {getConferences()}
                </div>
            )}
        </div>
    );
}

const defaultFilters: TalksService.Models.Conference.GetQuery = {
    name: '',
};

type ConferencesByDate = {
    date: Date;
    conferences: TalksService.Models.Conference.Get[];
};

const getDefaultDaysConferences = (): ConferencesByDate[] => {
    const conferencesByDate: ConferencesByDate[] = [];
    for (const day of CONFERENCES_DAYS) {
        conferencesByDate.push({
            date: day,
            conferences: [],
        });
    }
    return conferencesByDate;
}

const getDateFilterOptions = () => {
    let options = CONFERENCES_DAYS.map(date => ({
        key: date.toISOString(),
        value: date,
        label: date.toDateString(),
    }));

    return [{
        key: 'all',
        value: undefined,
        label: 'Tous',
    }, ...options];
}

type View =
    | 'schedule'
    | 'filtered'

export default ConferencesPage;