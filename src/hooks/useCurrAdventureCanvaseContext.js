import { CurrAdventureCanvaseContext } from '../context/CurrAdventureCanvaseContext'
import { useContext } from 'react'

export const useCurrAdventureCanvaseContext = () => {
    const context = useContext(CurrAdventureCanvaseContext)

    if (!context) {
        throw Error('useCurrAdventureCanvaseContext must be used inside an CurrAdventureCanvaseContextProvider')
    }
    
    return context
}