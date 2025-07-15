import {
    AuthenticationContext,
    AuthenticationContextProps,
    RouteType,
} from '@/contexts/AuthenticationContext';
import { useContext } from 'react';

const useAuthentication = <T extends RouteType>() => {
    return useContext<AuthenticationContextProps<T>>(AuthenticationContext);
}

export default useAuthentication;