import { createContext } from "react";
import { TalksService } from "@/services/talks-service";

export type RouteType = 'public' | 'protected';

export interface AuthenticationContextProps<T extends RouteType = 'public'> {
    isLoading: boolean;
    user: T extends 'public'
        ? TalksService.Models.User.Current | null
        : TalksService.Models.User.Current;
    login: (username: string, password: string) => Promise<boolean | void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthenticationContext = createContext<AuthenticationContextProps<RouteType>>(null!);