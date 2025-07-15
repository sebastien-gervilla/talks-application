// Librairies
import { useState, useEffect, useCallback, useRef } from 'react';

// Application
import { Response } from '@/helpers/request/response';
import { UseFetchReturn, FetchResponses, FetchConfiguration } from './useRequest.types';

const useRequest = <Responses extends FetchResponses>(
    configuration: FetchConfiguration<Responses>,
): UseFetchReturn<Responses> => {

    const [response, setResponse] = useState<Response<Responses> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { dependencies = [], requiredValues = [], onSuccess, onFailure } = configuration;

    // Flow control - Allows for better canceling

    const activeRequestRef = useRef<string | null>(null);
    const controllerReference = useRef<AbortController | null>(null);

    const request = useCallback(async (id: string) => {
        if (id !== activeRequestRef.current)
            return console.log(`Canceled "${id}".`);

        if (controllerReference.current)
            controllerReference.current.abort();

        controllerReference.current = new AbortController();

        setIsLoading(true);

        const response = await configuration.request(controllerReference.current);

        setResponse(response);

        if (response.ok) {
            if (onSuccess)
                onSuccess(response);
        } else {
            if (onFailure)
                onFailure();
        }

        if (id === activeRequestRef.current)
            setIsLoading(false);
    }, [...dependencies, onSuccess]);

    const enqueueRequest = useCallback(() => {
        if (!hasRequiredValues(requiredValues))
            return;

        // const id = crypto.randomUUID(); TODO: HTTPS for crypto
        const id = Math.random().toString(36).slice(2, 24);
        activeRequestRef.current = id;
        request(id);
    }, [...dependencies]);

    useEffect(() => {
        enqueueRequest();

        return () => controllerReference.current?.abort();
    }, [...dependencies]);

    return {
        response,
        isLoading,
        refresh: enqueueRequest
    }
}

const hasRequiredValues = (requiredValues: any[]) => {
    if (!requiredValues.length)
        return true;

    // [Warning]: This currently works with falsy values
    return !requiredValues.some(value => !value);
}

export default useRequest;