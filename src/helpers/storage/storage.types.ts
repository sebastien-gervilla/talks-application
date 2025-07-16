export interface ApplicationStorage {
    // Authentication
    'token': string;

    // Settings
    'theme': 'light' | 'dark';
    'is-sidebar-reduced': boolean;
}