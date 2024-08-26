import { createContext, useReducer } from "react"

export const TripPlanContext = createContext()

export const tripPlanReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_DATE':
            const updatedDates = [...state.dates, action.payload].sort((a, b) => new Date(a.starting) - new Date(b.starting))
            return {
                ...state,
                dates: updatedDates
            }
        case 'ADD_SCHEDULED':
            const updatedScheduled = [...state.scheduled, action.payload].sort((a, b) => a.day - b.day)
            return {
                ...state,
                scheduled: updatedScheduled
            }
        case 'DELETE_DATE':
            return {
                ...state,
                dates: state.dates.filter((d) => d !== action.payload)
            }
        case 'DELETE_SCHEDULED':
            return {
                ...state,
                scheduled: state.scheduled.filter((s) => s !== action.payload)
            }
        case 'RESET_ALL':
            return {
                dates: [],
                scheduled: []
            }
        default:
            return state
    }
}

export const TripPlanContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tripPlanReducer, {
        dates: [], scheduled: []
    })

    return (
        <TripPlanContext.Provider value={{...state, dispatch}}>
            { children }
        </TripPlanContext.Provider>
    )
}