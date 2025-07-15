import { HttpResponses } from "@/services/talks-service/interfaces/http-interface";
import { Models } from "@/services/talks-service/interfaces";

export interface Get extends HttpResponses {
    200: Models.Speaker.Get[];
}

export interface Post extends HttpResponses {
    204: never;
    400: {
        type:
        | 'missing-fields'
        | 'unknown-error'
    };
}

export interface Put extends HttpResponses {
    204: never;
    404: never;
    400: {
        type:
        | 'missing-fields'
        | 'unknown-error'
    };
}

export interface Delete extends HttpResponses {
    204: never;
    404: never;
}