// Librairies
import { FC } from 'react';

// Application
import '@/styles/index.scss';
import Router from './router/Router';
import { AuthenticationContextProvider } from '@/contexts/AuthenticationContext';

const Application: FC = () => {
    return (
        <div className='application'>
            <AuthenticationContextProvider>
                <Router />
            </AuthenticationContextProvider>
        </div>
    );
}

export default Application;