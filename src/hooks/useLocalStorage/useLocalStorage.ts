// Librairies
import { useState } from "react";

// Application
import { Storage, ApplicationStorage } from "@/helpers/storage";

const useLocalStorage = <Key extends keyof ApplicationStorage>(
    key: Key,
    defaultValue: ApplicationStorage[Key],
): [ApplicationStorage[Key], (newValue: ApplicationStorage[Key]) => void] => {

    const [value, setValue] = useState<ApplicationStorage[Key]>(() => {
        const initialValue = getInitialValue(key, defaultValue);
        Storage.set(key, initialValue);
        return initialValue;
    });

    const set = (newValue: ApplicationStorage[Key]) => {
        Storage.set(key, newValue);
        setValue(newValue);
    }

    return [value, set];
}

export default useLocalStorage;

const getInitialValue = <Key extends keyof ApplicationStorage>(
    key: Key,
    defaultValue: ApplicationStorage[Key]
) => {
    const item = Storage.get(key);
    if (item === null)
        return defaultValue;

    return item;
}