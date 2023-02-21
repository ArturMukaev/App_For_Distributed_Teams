import {useState, useCallback} from 'react'
import { logout } from '../redux/authReducer'
import { useDispatch } from "react-redux";

export const useHttp = () => { // Позволяет взаимодействовать с сервером

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {
                method, body, headers
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так')
            }

            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            if (e.message.toString() === "Нет авторизации") {
                dispatch(logout());
            }
            setError(e.message)
            throw e
        }
    }, [])
    const clearError = useCallback(() => {
        setError(null)
    }, [])
    return {loading, request, error, clearError}
}