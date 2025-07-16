// Librairies
import { FC, ReactElement, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Application
import './toast.scss';

interface Props {
    isOpened: boolean;
    variant: ToastVariant;
    title?: string;
    description: string;
    action?: ReactElement;
    onClose: () => void;
    duration?: number;
    className?: string;
}

const Toast: FC<Props> = ({ isOpened, variant, title, description, action, onClose, duration = 6000, className }) => {

    const timeoutReference = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timeoutReference.current = setTimeout(() => onClose(), duration);

        return () => {
            if (timeoutReference.current)
                clearTimeout(timeoutReference.current);
        };
    }, [isOpened, duration]);

    return isOpened && createPortal((
        <div className={`toast ${variant}` + (className ? ` ${className}` : '')}>
            <div className="content">
                {!!title && (
                    <p className="title">
                        {title}
                    </p>
                )}
                <p className="description">
                    {description}
                </p>
            </div>
            {action ? action : (
                <button
                    className='icon-button'
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
            )}
        </div>
    ), document.body);
};

export type ToastVariant =
    | 'neutral'
    | 'positive'
    | 'destructive'

export default Toast;