// Librairies
import { FC } from 'react';

// Application
import './page.scss';
import { Confirmation, Modal, Page, Toast } from '@/components';
import { PrimaryLayout } from '@/layouts';
import { useAuthentication, useLocalStorage, useModal, useRequest, useToast } from '@/hooks';
import { Header } from '@/components/Header';
import { RouteSegment } from '@/application/router/types';
import { TalksService, talksService } from '@/services/talks-service';
import { SpeakerForm } from './components';
import { PenLine, X } from 'lucide-react';

const SpeakersPage: FC = () => {

    const [isReduced, setIsReduced] = useLocalStorage('is-sidebar-reduced', false);

    const handleToggleSidebar = () => setIsReduced(!isReduced);

    return (
        <Page id='speakers-page'>
            <PrimaryLayout isSidebarReduced={isReduced}>
                <Header
                    path={[{
                        to: `/${RouteSegment.Speakers}`,
                        title: 'Conférenciers',
                    }]}
                    toggleSidebar={handleToggleSidebar}
                />
                <Speakers />
            </PrimaryLayout>
        </Page>
    );
}

const Speakers = () => {

    const { isAdministrator } = useAuthentication<'protected'>();

    const modal = useModal();
    const toast = useToast();

    const speakersRequest = useRequest({
        request: talksService.speakers.get,
    });
    const speakers = speakersRequest.response?.is(200)
        ? speakersRequest.response.body
        : [];

    const handleAddSpeaker = () => {
        modal.openWith(
            <SpeakerForm
                initialForm={{
                    firstName: '',
                    lastName: '',
                    biography: '',
                }}
                onSubmit={async (form) => { // [error-handling] - TODO: Error handling
                    const response = await talksService.speakers.create(form);
                    if (!response.is(204))
                        return toast.openDefaultFailure();

                    modal.close();
                    speakersRequest.refresh();
                    toast.openDefaultSuccess();
                }}
                onCancel={modal.close}
            />
        );
    }

    const handleUpdateSpeaker = (speaker: TalksService.Models.Speaker.Get) => {
        modal.openWith(
            <SpeakerForm
                initialForm={speaker}
                onSubmit={async (form) => { // [error-handling] - TODO: Error handling
                    const response = await talksService.speakers.update(speaker.id, form);
                    if (!response.is(204))
                        return toast.openDefaultFailure();

                    modal.close();
                    speakersRequest.refresh();
                    toast.openDefaultSuccess();
                }}
                onCancel={modal.close}
            />
        );
    }

    const handleDeleteSpeaker = (speaker: TalksService.Models.Speaker.Get) => {
        modal.openWith(
            <Confirmation
                onValidate={async () => { // [error-handling] - TODO: Error handling
                    const response = await talksService.speakers.delete(speaker.id);
                    if (!response.is(204))
                        return toast.openDefaultFailure();

                    modal.close();
                    speakersRequest.refresh();
                    toast.openDefaultSuccess();
                }}
                onCancel={modal.close}
            />
        );
    }

    const displaySpeakers = () => {
        return speakers.map((speaker) => (
            <div
                key={speaker.id}
                className="speaker"
            >
                <div className="top">
                    <p className='name'>{speaker.firstName} {speaker.lastName}</p>
                    {isAdministrator && (
                        <div className="actions">
                            <button
                                className='icon-button'
                                onClick={() => handleUpdateSpeaker(speaker)}
                            >
                                <PenLine />
                            </button>
                            <button
                                className='icon-button destructive'
                                onClick={() => handleDeleteSpeaker(speaker)}
                            >
                                <X />
                            </button>
                        </div>
                    )}
                </div>
                <p className='biography'>{speaker.biography}</p>
            </div>
        ));
    }

    return (
        <div className="speakers-flow">
            <Modal {...modal} />
            <Toast {...toast} />
            <div className="header">
                <button
                    className='animated'
                    onClick={() => isAdministrator && handleAddSpeaker()}
                >
                    Ajouter un conférencier
                </button>
            </div>
            <div className="speakers">
                {displaySpeakers()}
            </div>
        </div>
    );
}

export default SpeakersPage;