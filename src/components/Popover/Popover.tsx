// Librairies
import { ReactNode, useRef, RefObject } from 'react';
import { createPortal } from 'react-dom';

// Application
import './popover.scss';
import { useClickOutside } from '@/hooks';
import { getPopoverPosition } from './utils';
import { PopoverOrigin, PopoverPosition } from './types';
import { ClickOutsideTarget } from '@/hooks/useClickOutside';

interface PopoverProps {
    isOpened: boolean;
    origin: PopoverOrigin;
    body: ReactNode;
    onClose: () => void;
    position?: PopoverPosition;
    darkenBackground?: boolean;
    getClickOutsideExceptions?: (popoverRef: RefObject<HTMLDivElement>) => ClickOutsideTarget[];
}

const Popover = ({ isOpened, origin, position, onClose, body, getClickOutsideExceptions }: PopoverProps) => {

    const popoverRef = useRef<HTMLDivElement>(null);

    const popupPosition = getPopoverPosition(origin, position);

    const exceptions = getClickOutsideExceptions
        ? getClickOutsideExceptions(popoverRef as RefObject<HTMLDivElement>)
        : popoverRef;

    useClickOutside(exceptions, onClose);

    return isOpened && createPortal((
        <div
            className="popover"
            ref={popoverRef}
            style={popupPosition}
        >
            <div className="popover-content">
                {body}
            </div>
        </div>
    ), document.body);
};

export default Popover;