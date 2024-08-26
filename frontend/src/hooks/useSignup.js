import { useState } from "react"
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [success, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, username, password, userType) => {
        setError(null)
        setSuccessMsg(null)

        setIsLoading(true)
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, username, password, userType})
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
            setSuccessMsg(null)
        }
        if (response.ok) {
            if (userType === 'traveler') {
                // save the user to local storage
                localStorage.setItem('user', JSON.stringify(json))

                // update the auth context
                dispatch({type: 'LOGIN', payload: json})
            }
            else {
                setError(null)
                setSuccessMsg(json)
            }

            setIsLoading(false)
        }
    }

    return { signup, isLoading, error, success}
}