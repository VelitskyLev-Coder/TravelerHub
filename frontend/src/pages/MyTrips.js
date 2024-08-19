import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap';

// components
import MyTripAdventureCanvase from '../components/MyTripAdventureCanvase'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useAdventureCanvaseContext } from '../hooks/useAdventureCanvaseContext'

const MyTrips = () => {
    const {user} = useAuthContext()
    const {adventureCanvases, dispatch} = useAdventureCanvaseContext()

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => { 
        setIsLoading(true)

        const fetchAdventureCanvase = async () => {
            const response = await fetch(`/api/adventureCanvas/getTourOperatorTrips/${user.email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_ALL_ADVENTURE_CANVASES', payload: json})
                setIsLoading(false)
            }

            if (!response.ok) {
                setError(json.error)
                setIsLoading(false)
            }
        }

        user && fetchAdventureCanvase()
    }, [user, dispatch])

    return(
        <section className='background'>

            
            
            { isLoading && 
                <div className='no-result-label'>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>Loading...</span>
                </div>
            }

            { !isLoading && error &&  
                <label className='center-page'>{error}</label>
            }

            { !isLoading && !error &&
                <table className='mybooking-table'>
                    <tbody>
                        <tr>
                            <th>Trip name</th>
                            <th>Duration</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        
                        {adventureCanvases.map((adventureCanvas, idx) => (
                            <MyTripAdventureCanvase idx={idx} adventureCanvas={adventureCanvas} />
                        ))}
                    </tbody>
                </table>
            }
        </section>
    )
}

export default MyTrips