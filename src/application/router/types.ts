export enum RouteSegment {
    Register = 'register',
    Login = 'login',
    Conferences = 'conferences',
    Speakers = 'speakers',
}

export const isPublicRoute = (route: string) => {
    if (route.startsWith(`/${RouteSegment.Login}`))
        return true;

    if (route.startsWith(`/${RouteSegment.Register}`))
        return true;

    return false;
}