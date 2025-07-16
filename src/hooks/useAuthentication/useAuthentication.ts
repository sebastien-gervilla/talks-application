import {
    AuthenticationContext,
    AuthenticationContextProps,
    RouteType,
} from '@/contexts/AuthenticationContext';
import { TalksService } from '@/services/talks-service';
import { useContext } from 'react';

const useAuthentication = <T extends RouteType>() => {
    const context = useContext<AuthenticationContextProps<T>>(AuthenticationContext);

    const isAdministrator = context.user && context.user.role === TalksService.Models.User.Role.Administrator;

    return {
        ...context,
        isAdministrator,
    }
}

export default useAuthentication;