import { useAuthContext } from './useAuthContext'
import { useTripPlanContext } from './useTripPlanContext'
import { useCurrAdventureCanvaseContext } from './useCurrAdventureCanvaseContext'
import { useAdventureCanvaseContext } from './useAdventureCanvaseContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: dispatchTripPlan } = useTripPlanContext()
    const { dispatch: dispatchCurrAdventureCanvaseContext } = useCurrAdventureCanvaseContext()
    const { dispatch: dispatchAdventureCanvaseContext } = useAdventureCanvaseContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch ({type: 'LOGOUT'})
        dispatchTripPlan ({type: 'RESET_ALL'})
        dispatchCurrAdventureCanvaseContext ({type: 'RESET_ALL'})
        dispatchAdventureCanvaseContext ({type: 'RESET_ALL'})
    }

    return {logout}
}