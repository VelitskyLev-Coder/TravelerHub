import {React, useEffect} from 'react';
import { useState } from 'react';
import { Accordion, Spinner } from 'react-bootstrap'

// components
import AdminManageAdventureCanvase from '../components/AdminManageAdventureCanvase'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'

const ManageTrips = () => {

    const {user} = useAuthContext()
    const [unpublished, setUnpublished] = useState([])
    const [unconfirmed, setUnconfirmed] = useState([])

    const [publishedError, setPublishedError] = useState(null)
    const [confirmedError, setConfirmedError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => { 
        setIsLoading(true)

        const fetchUnpublishedAdventureCanvases = async () => {
            const response = await fetch('/api/manageTrips/getUnpublished', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setUnpublished(json)
                setIsLoading(false)
                setPublishedError(null)
            }

            if (!response.ok) {
                setPublishedError(json.error)
            }
        }

        user && fetchUnpublishedAdventureCanvases()
    }, [user])

    useEffect(() => { 
        setIsLoading(true)

        const fetchUnconfirmedAdventureCanvases = async () => {
            const response = await fetch('/api/manageTrips/getUnconfirmed', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setUnconfirmed(json)
                setIsLoading(false)
                setConfirmedError(null)
            }

            if (!response.ok) {
                setIsLoading(false)
                setConfirmedError(json.error)
            }
        }

        user && fetchUnconfirmedAdventureCanvases()
    }, [user])

    const removePublishedAdventureCanvase = (id) => {
        setUnpublished((prevUnpublished) => {
            const removedAdventureCanvas = prevUnpublished.find(adventureCanvas => adventureCanvas._id === id)
            const updatedUnpublished = prevUnpublished.filter(adventureCanvas => adventureCanvas._id !== id)
            setUnconfirmed((prevUnconfirmed) => [...prevUnconfirmed, removedAdventureCanvas])
            return updatedUnpublished;
        })
    }
    
    const removeConfirmedAdventureCanvase = (id) => {
        setUnconfirmed((prevUnconfirmed) => prevUnconfirmed.filter(adventureCanvas => adventureCanvas._id !== id))
    } 

    return (
        <section>
            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Unpublished Trips</Accordion.Header>
                    <Accordion.Body className='adventureCanvas-createATrip'>
                        { isLoading && <Spinner animation="border" role="status"></Spinner> }
                        { unpublished.length === 0 && (
                            <div>{ publishedError }</div>
                        )}

                        { unpublished.map((unpublishedAdventureCanvase, idx) => (
                            <div key={idx}>
                                <AdminManageAdventureCanvase 
                                    adventureCanvase={unpublishedAdventureCanvase}
                                    removeAdventureCanvase={removePublishedAdventureCanvase}
                                    type='unpublished'
                                />
                            </div>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Confirmation of Trips Dates</Accordion.Header>
                    <Accordion.Body className='adventureCanvas-createATrip'>

                        { unconfirmed.length === 0 && (
                            <div>{ confirmedError }</div>
                        )}

                        { unconfirmed.map((unconfirmedAdventureCanvase, idx) => (
                            <div key={idx}>
                                <AdminManageAdventureCanvase 
                                    adventureCanvase={unconfirmedAdventureCanvase}
                                    removeAdventureCanvase={removeConfirmedAdventureCanvase}
                                    type='unconfirmed'
                                />
                            </div>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>
        </section>
    )
}

export default ManageTrips