import { HttpResponses } from "@/services/talks-service/interfaces/http-interface";
import { Models } from "@/services/talks-service/interfaces";

export interface Get extends HttpResponses {
    200: Models.Conference.Get[];
}

export interface GetAvailableSlots extends HttpResponses {
    200: Models.Conference.GetAvailableSlot[];
}

export interface Post extends HttpResponses {
    204: never;
    400: {
        type:
        | 'missing-fields'
        | 'room-not-found'
        | 'speaker-not-found'
        | 'unknown-error'
    };
}

export interface Put extends HttpResponses {
    204: never;
    404: never;
    400: {
        type:
        | 'missing-fields'
        | 'room-not-found'
        | 'speaker-not-found'
        | 'unknown-error'
    };
}

export interface Delete extends HttpResponses {
    204: never;
    404: never;
}

export interface Join extends HttpResponses {
    204: never;
    404: never;
    400: {
        type:
        | 'room-already-full'
        | 'already-joined'
        | 'slot-conflict'
        | 'unknown-error'
    };
}

export interface Leave extends HttpResponses {
    204: never;
    404: never;
    400: {
        type:
        | 'not-yet-joined'
        | 'unknown-error'
    };
}