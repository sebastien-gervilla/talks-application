import { Models } from "@/services/talks-service/interfaces";
import { HttpResponses } from "@/services/talks-service/interfaces/http-interface";

export interface GetCurrent extends HttpResponses {
    200: Models.User.Current;
}

export interface DeleteCurrent extends HttpResponses {
    204: never;
    404: never;
}

export interface GetCurrentConferences extends HttpResponses {
    200: Models.Conference.GetByDay[];
}

export interface Register extends HttpResponses {
    204: never;
    400: {
        type:
        | 'missing-fields'
        | 'invalid-email'
        | 'email-already-used'
        | 'unknown-error'
    };
}

export interface Login extends HttpResponses {
    204: never;
    404: never;
    400: {
        type:
        | 'missing-fields'
        | 'invalid-identifiers'
        | 'unknown-error'
    };
}

export interface Logout extends HttpResponses {
    204: never;
}