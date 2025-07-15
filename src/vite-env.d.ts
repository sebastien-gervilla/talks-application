/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TALKS_SERVICE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv,
}

declare type ValueOf<T> = T[keyof T]