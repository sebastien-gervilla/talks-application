export interface Position {
    x: number;
    y: number;
}

export type PopoverOrigin =
    | HTMLElement
    | Position
    | null;

/**
 * @description The position relative to the anchor element.
 * Should only be used together with an HTMLElement anchor.
 */
export interface PopoverPosition {
    anchorOrigin?: {
        vertical?: VerticalPosition;
        horizontal?: HorizontalPosition;
    };
    bodyOrigin?: {
        vertical?: VerticalPosition;
        horizontal?: HorizontalPosition;
    },
    gap?: {
        vertical?: number;
        horizontal?: number;
    };
}

export type VerticalPosition = 'top' | 'center' | 'bottom';
export type HorizontalPosition = 'left' | 'center' | 'right';

export enum PositionMultiplier {
    'top' = 0,
    'left' = 0,
    'center' = 0.5,
    'right' = 1,
    'bottom' = 1
}