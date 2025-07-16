// Librairies
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

// Application
import './user-profile.scss';
import { Confirmation, Modal, Toast } from '@/components';
import { useAuthentication, useModal, useToast } from '@/hooks';
import { talksService } from '@/services/talks-service';
import { RouteSegment } from '@/application/router/types';

interface Props {
    onCancel: () => void;
}

const UserProfile: FC<Props> = ({ onCancel }) => {

    const toast = useToast();
    const modal = useModal();

    const navigate = useNavigate();

    const { user } = useAuthentication<'protected'>();

    const handleDeleteAccount = () => {
        modal.openWith(
            <Confirmation
                onValidate={async () => {
                    const response = await talksService.users.deleteCurrent();
                    if (!response.is(204))
                        return toast.openDefaultFailure();

                    navigate(`/${RouteSegment.Register}`);
                }}
                onCancel={modal.close}
            />
        );
    }

    return (
        <div className="user-profile">
            <Toast {...toast} />
            <Modal {...modal} />
            <div className="header">
                <h3>Mon profile</h3>
            </div>
            <section className='personal-informations'>
                <h4>Informations personnelles</h4>
                <div className="informations">
                    <div className="names">
                        <p>Prénom</p>
                        <p>Nom</p>
                        <p>Email</p>
                    </div>
                    <div className="values">
                        <p>{user.lastName}</p>
                        <p>{user.firstName}</p>
                        <p>{user.email}</p>
                    </div>
                </div>
            </section>
            <div className="footer">
                <button
                    className="animated text ghost"
                    onClick={onCancel}
                >
                    Fermer
                </button>
                <button
                    className="animated outlined destructive submit with-icon"
                    onClick={handleDeleteAccount}
                >
                    <TriangleAlert />
                    Supprimer mon compte
                </button>
            </div>
        </div>
    );
}

export default UserProfile;