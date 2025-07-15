// Librairies
import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Application
import './protected-route.scss';
import { useAuthentication } from '@/hooks';
import { Loader } from '@/components';

interface Props {
    loginRoutePath?: string
}

const ProtectedRoute: FC<Props> = ({ loginRoutePath = '/login' }) => {

    const { pathname } = useLocation();

    const { isAuthenticated, isLoading } = useAuthentication();

    if (isLoading)
        return (
            <div id='loading-page'>
                <Loader />
            </div>
        );

    if (!isAuthenticated)
        return <Navigate to={loginRoutePath} state={{ protectedPath: pathname }} />;

    return <Outlet />;
};

export default ProtectedRoute;