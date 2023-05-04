import {useState, useCallback} from 'react'
import {logout} from '../redux/reducers/authReducer'
import {useDispatch, useSelector} from "react-redux";
import {notify} from "../helpers/helper";
import {serverUrl} from "../helpers/helper";
import {selectors} from "../redux/selectors";

interface httpType {
    loading: boolean;
    request: (data: IFetchData<any>) => Promise<any>;
}

interface IFetchData<T> {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: HeadersInit;
    body?: T;
    file?: boolean;
}

export const useHttp = (): httpType => {

    const [loading, setLoading] = useState(false);
    const user = useSelector(selectors.user);
    const dispatch = useDispatch();

    const request = useCallback(async ({url, method = 'GET', body, headers = {}, file = false}: IFetchData<any>): Promise<any> => {
        setLoading(true);
        try {
            headers = new Headers();
            if (body && !file) {
                body = JSON.stringify(body);
                headers.set('Content-Type', 'application/json');
            }
            headers.set('Authorization', `Bearer ${user.token}`);
            const response = await fetch(serverUrl + url, {method, body, headers});
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            } else {
                data.message && notify(data.message.toString(), false);
            }

            setLoading(false);
            return data;
        } catch (e: any) {
            setLoading(false);
            const message = e.message.toString();
            if (message === "Нет авторизации") {
                dispatch(logout());
            }
            notify(message, true);
            throw e;
        }
    }, [setLoading, dispatch, user]);

    return {loading, request};
}