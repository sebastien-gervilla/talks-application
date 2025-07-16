import { TalksService } from "@/services/talks-service";

export const CREATE_CONFERENCE_ERRORS: {
    [Key in TalksService.Responses.Conference.Post[400]['type']]: string;
} = {
    'missing-fields': 'Champs manquants.',
    'room-not-found': 'Salle introuvable.',
    'speaker-not-found': 'Conférencier introuvable.',
    'unknown-error': 'Une erreur est survenue.',
};

export const UPDATE_CONFERENCE_ERRORS: {
    [Key in TalksService.Responses.Conference.Put[400]['type']]: string;
} = {
    'missing-fields': 'Champs manquants.',
    'room-not-found': 'Salle introuvable.',
    'speaker-not-found': 'Conférencier introuvable.',
    'unknown-error': 'Une erreur est survenue.',
};

export const JOIN_CONFERENCE_ERRORS: {
    [Key in TalksService.Responses.Conference.Join[400]['type']]: string;
} = {
    'already-joined': 'Conférence déjà jointe.',
    'room-already-full': 'Conférence pleine.',
    'slot-conflict': 'Vous êtes déjà inscrit à une autre conférence à cet horaire.',
    'unknown-error': 'Une erreur est survenue.',
};

export const LEAVE_CONFERENCE_ERRORS: {
    [Key in TalksService.Responses.Conference.Leave[400]['type']]: string;
} = {
    'not-yet-joined': 'Conférence non jointe.',
    'unknown-error': 'Une erreur est survenue.',
};