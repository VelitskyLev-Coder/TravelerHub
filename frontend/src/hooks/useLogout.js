import { useAuthContext } from './useAuthContext'
import { useTripPlanContext } from './useTripPlanContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: dispatchTripPlan } = useTripPlanContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch ({type: 'LOGOUT'})
        dispatchTripPlan ({type: 'RESET_ALL'})
    }

    return {logout}
}