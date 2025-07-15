// Librairies
import { FC, useContext } from 'react';

// Application
import './header.scss';
import { Path } from '../Breadcrumbs/Breadcrumbs.types';
import { Moon, PanelLeft, Sun } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs';
import { useModal, usePopover } from '@/hooks';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Popover } from '../Popover';
import { Modal } from '../Modal';

interface Props {
    path: Path;
    toggleSidebar: () => void;
}

const Header: FC<Props> = ({ path, toggleSidebar }) => {

    const modal = useModal();
    const popover = usePopover();

    const { theme, setTheme } = useContext(ThemeContext);

    const handleToggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <header className='header'>
            <Modal {...modal} />
            <Popover
                {...popover}
                position={{
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'bottom'
                    },
                    bodyOrigin: {
                        horizontal: 'right',
                        vertical: 'top'
                    },
                    gap: {
                        vertical: 8
                    }
                }}
            />
            <div className="left">
                <button
                    className='icon-button'
                    onClick={toggleSidebar}
                >
                    <PanelLeft />
                </button>
                <Breadcrumbs path={path} />
            </div>
            <div className="right">
                <div className="actions">
                    <button
                        className='icon-button'
                        onClick={handleToggleTheme}
                    >
                        {(
                            theme === 'dark'
                                ? <Sun />
                                : <Moon />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;