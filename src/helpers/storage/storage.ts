import { ApplicationStorage } from "./storage.types";

export default class Storage {

    // [security] - We could have a runtime type validation to prevent type evolution from crashing the app
    static get<Key extends keyof ApplicationStorage>(key: Key): ApplicationStorage[Key] | null {
        const item = localStorage.getItem(key);

        return item
            ? JSON.parse(item)
            : null;
    }

    static set<Key extends keyof ApplicationStorage>(key: Key, value: ApplicationStorage[Key]) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key: keyof ApplicationStorage) {
        return localStorage.removeItem(key);
    }
}