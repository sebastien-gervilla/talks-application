// Librairies
import { FC, ReactNode } from "react";

// Application
import './badge.scss';
// import { Slot } from "@radix-ui/react-slot";

interface Props extends React.ComponentProps<"span"> {
    variant: BadgeVariant;
    children: ReactNode;
    isHidden?: boolean;
}

const Badge: FC<Props> = ({
    className,
    variant,
    children,
    isHidden,
    ...props
}) => {

    let composedClassName = `badge ${variant}`;
    if (isHidden)
        composedClassName += ' hidden';
    if (className)
        composedClassName += ` ${className}`;


    return (
        <div className="badge-wrapper">
            {children}
            <span
                data-slot="badge"
                className={composedClassName}
                {...props}
            />
        </div>
    );
}

type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outlined'

export default Badge;