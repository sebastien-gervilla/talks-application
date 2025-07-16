// Librairies
import { FC, JSX } from 'react';

// Application
import './page.scss';
import { Page, Toast } from '@/components';
import { PrimaryLayout } from '@/layouts';
import { useLocalStorage, useRequest, useToast } from '@/hooks';
import { TalksService, talksService } from '@/services/talks-service';
import { Header } from '@/components/Header';
import { RouteSegment } from '@/application/router/types';
import { Users } from 'lucide-react';
import { CONFERENCES_DAYS, getTimeFromSlot, MAX_SLOTS, ROOM_MAX_USERS, START_SLOT } from '@/constants/conferences';
import { isSameDay } from '@/utils/date-utils';

const ProgramPage: FC = () => {

    const [isReduced, setIsReduced] = useLocalStorage('is-sidebar-reduced', false);

    const handleToggleSidebar = () => setIsReduced(!isReduced);

    return (
        <Page id='program-page'>
            <PrimaryLayout isSidebarReduced={isReduced}>
                <Header
                    path={[{
                        to: `/${RouteSegment.Program}`,
                        title: 'Programme',
                    }]}
                    toggleSidebar={handleToggleSidebar}
                />
                <Program />
            </PrimaryLayout>
        </Page>
    );
}

const Program = () => {

    const toast = useToast();

    const daysConferencesRequest = useRequest({
        request: talksService.users.getCurrentConferences,
    });
    const daysConferences = daysConferencesRequest.response?.is(200)
        ? daysConferencesRequest.response.body
        : [];


    const handleLeaveConference = async (conference: TalksService.Models.Conference.Get) => {
        const response = await talksService.conferences.leave(conference.id);
        if (!response.is(204))
            return toast.openDefaultFailure();

        daysConferencesRequest.refresh();
        toast.openDefaultSuccess();
    }

    const displayDays = () => {
        const displayed: JSX.Element[] = [];

        for (const day of getDaysConferences()) {
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

    const getDaySlots = (day: TalksService.Models.Conference.GetByDay) => {
        const displayed: JSX.Element[] = [];

        for (let slot = START_SLOT; slot < MAX_SLOTS; slot++) {
            const conference = day.conferences.find(conference => conference.slot === slot);
            if (!conference)
                displayed.push(
                    <div
                        key={slot}
                        className='slot empty'
                    >
                        Vide
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
                    <p className='room'><span>Salle</span> : {conference.room}</p>
                    <p className='schedule'><span>Horaire</span> : {getTimeFromSlot(conference.slot)}h - {getTimeFromSlot(conference.slot) + 1}h</p>
                    <div className="bottom">
                        <div className="participants">
                            <Users />
                            <p>{conference.users.length}/{ROOM_MAX_USERS}</p>
                        </div>
                        <button
                            className='animated-link destructive'
                            onClick={() => handleLeaveConference(conference)}
                        >
                            Quitter
                        </button>
                    </div>
                </div>
            );
        }

        return displayed;
    }

    const getDaysConferences = () => {
        const conferencesByDate = getDefaultDaysConferences();

        for (const conference of daysConferences) {
            const dayConferences = conferencesByDate.find((day) => isSameDay(day.date, conference.date));
            if (!dayConferences)
                continue;

            dayConferences.conferences = conference.conferences;
        }

        return conferencesByDate;
    }

    return (
        <div className="program-flow">
            <Toast {...toast} />
            <div className="days">
                {displayDays()}
            </div>
        </div>
    );
}

const getDefaultDaysConferences = (): TalksService.Models.Conference.GetByDay[] => {
    const conferencesByDate: TalksService.Models.Conference.GetByDay[] = [];
    for (const day of CONFERENCES_DAYS) {
        conferencesByDate.push({
            date: day,
            conferences: [],
        });
    }
    return conferencesByDate;
}

export default ProgramPage;