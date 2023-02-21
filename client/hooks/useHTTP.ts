import {useState, useCallback} from 'react'
import {logout} from '../redux/authReducer'
import {useDispatch} from "react-redux";

interface httpType {
    loading: boolean;
    error: string | null;
    clearError: () => void;
    request: requestType;
}

type requestType = (url: string, method: string, body?: any, headers?: any) => any;

export const useHttp = (): httpType => { // Позволяет взаимодействовать с сервером

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();

    const request = useCallback(async (
        url: string,
        method: string = 'GET',
        body: any = null,
        headers: any = {}): Promise<any> => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }
            const response = await fetch(url, {
                method, body, headers
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }

            setLoading(false);
            return data;
        } catch (e: any) {
            setLoading(false);
            if (e.message.toString() === "Нет авторизации") {
                dispatch(logout());
            }
            setError(e.message);
            throw e
        }
    }, []);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {loading, request, error, clearError}
}