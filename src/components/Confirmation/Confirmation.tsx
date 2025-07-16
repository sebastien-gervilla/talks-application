// Libraries
import { FC } from 'react';

// Application
import './confirmation.scss';
import { TriangleAlert } from 'lucide-react';

interface Props {
    message?: string;
    onValidate: () => void;
    onCancel: () => void;
}

const Confirmation: FC<Props> = ({ onValidate, onCancel, message }) => {

    const warningMessage = message
        ? message
        : "Cette action est irréversible.";

    return (
        <div className='confirmation'>
            <div className="informations">
                <TriangleAlert size={64} />
                <p className="title">
                    Êtes vous sûr ?
                </p>
                <p className="message">
                    {warningMessage}
                </p>
            </div>
            <div className='buttons'>
                <button
                    className='animated validate'
                    onClick={onValidate}
                >
                    Valider
                </button>
                <button
                    className='animated outlined cancel'
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </div>
    )
}

export default Confirmation;