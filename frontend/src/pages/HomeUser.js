import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'

// components
import AdventureCanvase from '../components/AdventureCanvas'
import ErrorMsg from '../components/ErrorMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useAdventureCanvaseContext } from '../hooks/useAdventureCanvaseContext'

const HomeUser = () => {
    const {user} = useAuthContext()
    const {adventureCanvases, dispatch} = useAdventureCanvaseContext()

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [destination, setDestination] = useState('')
    const [duration, setDuration] = useState('')
    const [filteredCanvases, setFilteredCanvases] = useState([])

    const handleSearch = () => {
        if(destination.trim() === '' && duration.trim() === '') {
            setFilteredCanvases(adventureCanvases)
            return
        }

        const filtered = adventureCanvases.filter(adventureCanvase => {
            const matchesDestination = adventureCanvase.tripName.toLowerCase().includes(destination.toLowerCase().trim())
            const matchesDuration = duration ? adventureCanvase.duration === parseInt(duration, 10) : true
            return matchesDestination && matchesDuration
        })
        setFilteredCanvases(filtered)
    }    
    
    useEffect(() => { 
        setIsLoading(true)

        const fetchAdventureCanvases = async () => {
            const response = await fetch('/api/adventureCanvas/getAll', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_ALL_ADVENTURE_CANVASES', payload: json})
                setFilteredCanvases(json)
                setIsLoading(false)
            }

            if (!response.ok) {
                setError(json.error)
            }
        }

        user && fetchAdventureCanvases()
    }, [user, dispatch])

    return(
        <section>
            <div className='search-div'>
                <label className='title-search'><b>Where Will Your Adventure Begin?</b></label>
                <input 
                    type='text' 
                    placeholder='Destination' 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}>
                </input>

                <input 
                    type='number' 
                    placeholder='Duration' 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}>
                </input>

                <button onClick={handleSearch}>Search</button>
            </div>

            { error &&  <ErrorMsg msg={error}/> }
            
            { isLoading && 
                <div className='no-result-label'>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>Loading...</span>
                </div>
            }

            { !isLoading && 
                <>
                    { filteredCanvases.length === 0 &&
                        <label className='center-page'>No trips found.</label>
                    }

                    { filteredCanvases.length > 0 && 
                        <div xs={1} md={2} lg={3} className="grid-card-adventureCanvase-div">
                            {filteredCanvases.map((adventureCanvase, idx) => (
                                <div key={idx}>
                                    <AdventureCanvase adventureCanvase={adventureCanvase} />
                                </div>
                            ))}
                        </div> 
                    }
                </>
            }
        </section>
    )
}

export default HomeUser