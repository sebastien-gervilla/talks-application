import qs from 'qs';
import { HttpRequest, HttpResponse, Configuration, Method, RequestOptions, RequestUrl } from './request.types';
import { Response } from './response';

export default class RequestHelper {
    
    protected static target: string;
    protected static getDefaultOptions: () => RequestOptions;
    protected static onSuccess?: <Responses extends HttpResponse>(response: Response<Responses>) => void;

    // Base methods
    // -------------------------------------------------------------------------------------------

    
    private static async make<Request extends HttpRequest, Responses extends HttpResponse>(
        method: Method,
        configuration: Configuration<Request>
    ): Promise<Response<Responses>> {
        const { url, options, query, body } = this._getConfiguration<Request>({
            ...configuration,
            options: {
                ...configuration.options,
                method
            }
        });

        if (body instanceof FormData) {
            const { ['Content-Type']: _, ...restHeaders } = options.headers as any;
            options.headers = restHeaders;
            options.body = body;
        }
        else if (!['GET', 'DELETE'].includes(method) && body)
            options.body = JSON.stringify(body);
        
        try {
            const requestUrl = this._getRequestUrl(url, query);

            const response = await fetch(requestUrl, options);
            const { ok, status, statusText } = response;

            let responseBody: any = null;
            if (status !== 204) {
                if (configuration.responseType === 'blob')
                    try {
                        responseBody = await response.blob();
                    } catch (error) {
                        console.log(`Error while parsing response blob: ${error}`);
                    }
                    
                else
                    try {
                        responseBody = await response.json();
                    } catch (error) {
                        console.log(`Error while parsing response json: ${error}`);
                    }
            }

            const HttpResponse = new Response<Responses>(
                ok,
                status,
                statusText,
                responseBody
            );

            this.onSuccess?.(HttpResponse);
            return HttpResponse;
        } catch (error) {
            return this._handleErrorResponse(url, method, error);
        }
    }


    // Abstraction methods
    // -------------------------------------------------------------------------------------------


    static get<
        Request extends HttpRequest = never,
        Responses extends HttpResponse = never,
    >(configuration: Configuration<Request>) {
        return this.make<Request, Responses>('GET', configuration);
    }

    static post<
        Request extends HttpRequest = never,
        Responses extends HttpResponse = never,
    >(configuration: Configuration<Request>) {
        return this.make<Request, Responses>('POST', configuration);
    }

    static put<
        Request extends HttpRequest = never,
        Responses extends HttpResponse = never,
    >(configuration: Configuration<Request>) {
        return this.make<Request, Responses>('PUT', configuration);
    }

    static patch<
        Request extends HttpRequest = never,
        Responses extends HttpResponse = never,
    >(configuration: Configuration<Request>) {
        return this.make<Request, Responses>('PATCH', configuration);
    }

    static delete<
        Request extends HttpRequest = never,
        Responses extends HttpResponse = never,
    >(configuration: Configuration<Request>) {
        return this.make<Request, Responses>('DELETE', configuration);
    }

    // Utils
    // -------------------------------------------------------------------------------------------

    private static _getRequestUrl<Query extends HttpRequest['query']>(
        url: RequestUrl,
        query?: Query,
    ): RequestUrl {
        if (!this.target)
            throw new Error(`Invalid request target '${this.target}'.`)

        let requestUrl = this.target + url;

        if (query) requestUrl += `?${qs.stringify(query, {
            skipNulls: true,
            arrayFormat: 'repeat',
        })}`;

        return requestUrl;
    }

    private static _getConfiguration<Request extends HttpRequest>(configuration: Configuration<Request>) {
        return {
            ...configuration,
            options: this._getOptions(
                configuration.options
            ),
        }
    }

    private static _getOptions(options?: RequestOptions): RequestOptions {
        const defaultOptions = this.getDefaultOptions();

        if (!options) return defaultOptions;

        return {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        }
    }

    // Error handling
    // -------------------------------------------------------------------------------------------

    private static _handleErrorResponse <Responses extends HttpResponse>(
        url: RequestUrl, 
        method: Method, 
        error: any
    ): Response<Responses> {
        console.log(
            'Error on api request.\n',
            `\t- method: ${method}\n`,
            `\t- url: ${url}\n`,
            error
        );

        return new Response<Responses>(
            false,
            500,
            error,
            null as never
        );
    }
}