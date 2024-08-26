import { createContext, useReducer } from "react"

export const AdventureCanvaseContext = createContext()

export const adventureCanvaseReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALL_ADVENTURE_CANVASES':
            return {
                adventureCanvases: action.payload
            }
        case 'RESET_ALL':
            return {
                adventureCanvases: []
            }
        default:
            return state
    }
}

export const AdventureCanvaseContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(adventureCanvaseReducer, {
        adventureCanvases: []
    })

    return (
        <AdventureCanvaseContext.Provider value={{...state, dispatch}}>
            { children }
        </AdventureCanvaseContext.Provider>
    )
}