import { RouteSegment, isPublicRoute } from '@/application/router/types';
import { RequestHelper } from '@/helpers/request';
import { HttpResponse, RequestOptions } from '@/helpers/request/request.types';
import { Response } from '@/helpers/request/response';

export class Request extends RequestHelper {

    public static target = import.meta.env.VITE_TALKS_SERVICE_URL;

    public static getDefaultOptions = (): RequestOptions => {
        return {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    }

    protected static onSuccess = <Responses extends HttpResponse>(response: Response<Responses>) => {
        if (response.status === 401 && !isPublicRoute(window.location.pathname))
            window.location.href = `/${RouteSegment.Login}`;
    };

}