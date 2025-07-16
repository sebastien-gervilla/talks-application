// Librairies
import { FC, JSX } from 'react';

// Application
import './breadcrumb.scss';
import { Path } from './Breadcrumbs.types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Props {
    path: Path;
}

const Breadcrumbs: FC<Props> = ({ path }) => {

    if (!path.length)
        throw new Error("Breadcrumbs path must be specified.");

    const displayPath = () => {
        if (path.length === 1) return (
            <p className='part'>
                {path[0].title}
            </p>
        );

        let displayedPath: JSX.Element[] = [];
        for (let i = 0; i < path.length - 1; i++) {
            const currentPath = path[i];
            displayedPath.push(
                <Link
                    key={currentPath.to}
                    to={currentPath.to}
                    className='part animated ghost'
                >
                    {currentPath.title}
                </Link>
            );

            displayedPath.push(
                <ChevronRight key={`icon-${currentPath.to}`} />
            );
        }

        const lastPath = path[path.length - 1];
        displayedPath.push(
            <p
                key={lastPath.to}
                className='part'
            >
                {lastPath.title}
            </p>
        );

        return displayedPath;
    }

    return (
        <div className='breadcrumbs'>
            {displayPath()}
        </div>
    );
}

export default Breadcrumbs;