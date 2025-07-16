export interface ValidTargets {
    [key: string]: string;
}

export interface BaseConfiguration<Targets extends ValidTargets> {
    targets: Targets;
    defaultTarget: keyof Targets;
    defaultOptions: RequestOptions;
}

export type Configuration<Request extends HttpRequest> = {
    url: RequestUrl;
    options?: RequestOptions;
    responseType?: 'json' | 'blob';
} & ConfigurationBody<Request> & ConfigurationQuery<Request>;

export type ConfigurationBody<Request extends HttpRequest> =
    keyof Request['body'] extends never
        ? { body?: never }
        : { body: Request['body'] }

export type ConfigurationQuery<Request extends HttpRequest> =
    keyof Request['query'] extends never
        ? { query?: never }
        : { query: Request['query'] }

export interface RequestOptions extends RequestInit {};
export type RequestUrl = URL | RequestInfo;

export type Method =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';

export interface HttpResponse {
    401: never;
    403: never;
    500: never;
}

export type HttpRequest = {
    parameters?: {};
    query?: {};
    body?: {};
};