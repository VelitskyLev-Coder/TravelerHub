import { TripPlanContext } from '../context/TripPlanContext'
import { useContext } from 'react'

export const useTripPlanContext = () => {
    const context = useContext(TripPlanContext)

    if (!context) {
        throw Error('useTripPlanContext must be used inside an TripPlanContextProvider')
    }
    
    return context
}