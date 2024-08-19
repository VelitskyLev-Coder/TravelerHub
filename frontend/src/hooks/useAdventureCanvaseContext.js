import { AdventureCanvaseContext } from '../context/AdventureCanvaseContext'
import { useContext } from 'react'

export const useAdventureCanvaseContext = () => {
    const context = useContext(AdventureCanvaseContext)

    if (!context) {
        throw Error('useAdventureCanvaseContext must be used inside an AdventureCanvaseContextProvider')
    }
    
    return context
}