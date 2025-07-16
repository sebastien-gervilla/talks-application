import { FC, ReactNode, useEffect, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContext";
import { TalksService, talksService } from "@/services/talks-service";

interface Props {
    children: ReactNode
}

const AuthenticationContextProvider: FC<Props> = ({ children }) => {

    const [user, setUser] = useState<TalksService.Models.User.Current | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email: string, password: string) => {
        if (!password.length)
            return setIsLoading(false);

        const loginResponse = await talksService.users.login({
            email,
            password,
        });

        if (!loginResponse.is(204))
            return setIsLoading(false);

        const response = await talksService.users.getCurrent();
        if (!response.is(200))
            return setIsLoading(false);

        setUser(response.body);

        setIsLoading(false);
        return true;
    }

    const logout = async () => {
        const response = await talksService.users.logout();
        if (response.is(204))
            setUser(null);
    }

    useEffect(() => {
        (async () => {
            const sessionUser = await getUserFromSession();

            if (sessionUser)
                setUser(sessionUser);

            setIsLoading(false);
        })()
    }, []);

    return (
        <AuthenticationContext.Provider
            value={{
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                user,
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationContextProvider;

const getUserFromSession = async (): Promise<TalksService.Models.User.Current | null> => {
    const response = await talksService.users.getCurrent();
    if (!response.is(200))
        return null;

    return response.body;
}