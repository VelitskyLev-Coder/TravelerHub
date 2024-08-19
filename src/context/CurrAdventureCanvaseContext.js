import { createContext, useReducer, useEffect } from "react";

export const CurrAdventureCanvaseContext = createContext()

export const currAdventureCanvaseReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_ADVENTURE_CANVASES':
            return {
                currAdventureCanvases: action.payload
            }
        default:
            return state
    }
}

export const CurrAdventureCanvaseContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(currAdventureCanvaseReducer, {
        currAdventureCanvases: null
    })

    useEffect(() => {
        const storedAdventureCanvases = JSON.parse(localStorage.getItem('currAdventureCanvases'));
        if (storedAdventureCanvases) {
            dispatch({ type: 'SET_CURRENT_ADVENTURE_CANVASES', payload: storedAdventureCanvases });
        }
    }, []);

    return (
        <CurrAdventureCanvaseContext.Provider value={{...state, dispatch}}>
            { children }
        </CurrAdventureCanvaseContext.Provider>
    )
}