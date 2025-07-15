// Librairies
import { FC, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, MicVocal, Presentation, User } from 'lucide-react';

// Application
import './sidebar.scss';
import { useAuthentication, useModal, usePopover } from '@/hooks';
import { Modal, Popover } from '@/components';

interface Props {
    isReduced: boolean;
}

const Sidebar: FC<Props> = ({ isReduced }) => {

    const { user, logout } = useAuthentication<'protected'>();

    const modal = useModal();
    const popover = usePopover();

    const getNavigation = (navigationTabs: Tabs) => {
        return navigationTabs.map(tab => {
            const label = !isReduced
                ? tab.name
                : undefined;

            return (
                <Link
                    key={tab.path}
                    to={tab.path}
                    className='menu-item'
                >
                    {tab.icon}
                    {label}
                </Link>
            );
        });
    }

    const handleOpenUserMenu = ({ currentTarget }: MouseEvent<HTMLElement>) => {
        popover.openFrom(currentTarget, (
            <div className="user-menu menu">
                <button key='logout' className="item" onClick={logout}>
                    <LogOut />
                    <p>Se déconnecter</p>
                </button>
            </div>
        ));
    }

    const displayUser = () => {
        if (!isReduced) return (
            <div
                role='button'
                tabIndex={1}
                className="user"
                onClick={handleOpenUserMenu}
            >
                <div className="informations">
                    <p className='name'>
                        {user.firstName} {user.lastName}
                    </p>
                    <p className='role'>
                        {user.role}
                    </p>
                </div>
                <User />
            </div>
        );

        return (
            <button
                className='icon-button'
                onClick={handleOpenUserMenu}
            >
                <User />
            </button>
        )
    }

    return (
        <div className={'sidebar ' + (isReduced ? 'reduced' : 'full')}>
            <Modal {...modal} />
            <Popover
                {...popover}
                position={{
                    anchorOrigin: {
                        vertical: 'bottom'
                    },
                    bodyOrigin: {
                        vertical: 'bottom'
                    },
                    gap: {
                        horizontal: 8
                    }
                }}
            />
            <div className="brand">
                {!isReduced ? (
                    <>
                        <p className='application-name'>TALKS</p>
                        <p className='company'>Salons d'affaires</p>
                    </>
                ) : <MicVocal />}
            </div>
            <div className="content">
                <section className='navigation'>
                    {!isReduced && (
                        <p className='title'>
                            Talks
                        </p>
                    )}
                    <ul>
                        {getNavigation(talksTabs)}
                    </ul>
                </section>
            </div>
            <div className="footer">
                {displayUser()}
            </div>
        </div>
    );
}

type Tabs = {
    path: string;
    name: string;
    icon: ReactNode;
}[];

const talksTabs: Tabs = [
    {
        path: '/conferences',
        name: 'Conférences',
        icon: <Presentation />,
    },
    {
        path: '/speakers',
        name: 'Conférenciers',
        icon: <MicVocal />,
    },
];

// const managementTabs: Tabs = [
//     {
//         path: '/management/power-supplies',
//         translationKey: 'powerSupplies',
//         icon: <BatteryCharging />,
//         permission: API.Permission.BATTERY_READ,
//     },
//     {
//         path: '/management/technologies',
//         translationKey: 'technologies',
//         icon: <Cpu />,
//         permission: API.Permission.BATTERY_TECHNOLOGY_READ,
//     },
//     {
//         path: '/management/packagings',
//         translationKey: 'packagings',
//         icon: <Box />,
//         permission: API.Permission.PACKAGING_READ,
//     },
//     {
//         path: '/management/packaging-categories',
//         translationKey: 'packagingCategories',
//         icon: <FileBox />,
//         permission: API.Permission.PACKAGING_CATEGORY_READ,
//     },
//     {
//         path: '/management/brands',
//         translationKey: 'brands',
//         icon: <Tag />,
//         permission: API.Permission.BRAND_READ,
//     },
//     {
//         path: '/management/universes',
//         translationKey: 'universes',
//         icon: <Atom />,
//         permission: API.Permission.UNIVERSE_READ,
//     },
// ]

export default Sidebar;