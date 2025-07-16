import { Response } from "@/helpers/request/response";

export interface FetchConfiguration<Responses extends FetchResponses> {
    request: FetchRequest<Responses>;
    dependencies?: any[];
    requiredValues?: any[];
    onSuccess?: (response: Response<Responses>) => void;
    onFailure?: () => void;
}

export interface UseFetchReturn<Responses extends FetchResponses> {
    response: Response<Responses> | null;
    isLoading: boolean;
    refresh: () => void;
}

export type FetchRequest<Responses extends FetchResponses> =
    (abortController: AbortController) => Promise<Response<Responses>>;

export interface FetchResponses {
    200: any;
    401: never;
    403: never;
    500: never;
}