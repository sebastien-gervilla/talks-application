// Librairies
import { FC, MouseEvent, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';

// Application
import './modal.scss';

interface Props {
    isOpened: boolean;
    onClose: () => void;
    body: ReactNode;
}

const Modal: FC<Props> = ({ isOpened, onClose, body }) => {

    const backdropReference = useRef<HTMLDivElement>(null);

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === backdropReference.current)
            onClose();
    }

    return isOpened && createPortal((
        <div
            id='modal-backdrop'
            ref={backdropReference}
            className={'modal-backdrop' + (isOpened ? ' opened' : '')}
            onMouseDown={handleMouseDown}
        >
            <div className="modal">
                {body}
            </div>
        </div>
    ), document.body);
}

export default Modal;