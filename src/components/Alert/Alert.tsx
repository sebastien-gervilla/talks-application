// Librairies
import { FC, ReactNode } from 'react';

// Application
import './alert.scss';

interface Props {
    children: ReactNode;
    variant: AlertVariant;
    className?: string;
    filled?: boolean;
}

const Alert: FC<Props> = ({ children, variant, className, filled = false }) => {

    let mergedClassName = `alert ${variant}`;
    if (filled)
        mergedClassName += ' filled';
    if (className)
        mergedClassName += ` ${className}`;

    return (
        <div
            role='alert'
            className={mergedClassName}
        >
            {children}
        </div>
    );
}

export type AlertVariant =
    | 'positive'
    | 'preventive'
    | 'destructive'

export default Alert;