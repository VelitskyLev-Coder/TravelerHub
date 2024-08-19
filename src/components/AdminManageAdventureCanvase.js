import { useEffect, useState } from 'react'
import { Card, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// components
import ErrorMsg from './ErrorMsg'
import SuccessMsg from './SuccessMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const AdminManageAdventureCanvase = ({ adventureCanvase, removeAdventureCanvase, type }) => {

    const { user } = useAuthContext()
    const {dispatch} = useCurrAdventureCanvaseContext()

    const [error, setError] = useState(null)
    const [success, setSuccessMsg] = useState(null)
    const [removeAfterClose, setRemoveAfterClose] = useState(false)
    const [tourOperators, setTourOperators] = useState([])
    const [assignTourOperator, setAssignTourOperator] = useState({
        username:'',
        email:'',
        photo:''
    })

    const [showMsg, setShowMsg] = useState(false)
    const handleCloseMsg = () => {
        setShowMsg(false);
        if (removeAfterClose) {
            setRemoveAfterClose(false)
            removeAdventureCanvase(adventureCanvase._id);
        }
    }
    
    const setAdminManageAdventureCanvase = () => {
        localStorage.setItem('currAdventureCanvases', JSON.stringify(adventureCanvase)); // Save to local storage
        dispatch({type: 'SET_CURRENT_ADVENTURE_CANVASES', payload: adventureCanvase})
    }

    useEffect(() => { 
        const fetchTourOperators = async () => {
            const response = await fetch('/api/manageTrips/getAllTourOperators', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setTourOperators(json)
                setError(null)
            }

            if (!response.ok) {
                setTourOperators([json.error])
                setError(json.error)
            }
        }

        user && fetchTourOperators()
    }, [user])

    const publishTrip = async () => {
        // Check if a tour operator is selected
        if (!assignTourOperator.username) { 
            setError('Please select a tour operator before publishing the trip.')
            setShowMsg(true)
            return
        }

        const response = await fetch('api/manageTrips/publishTrip', {
            method: 'PATCH',
            body: JSON.stringify({ adventureCanvas_id: adventureCanvase._id, assignTourOperator}),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setSuccessMsg(null)
        }

        if (response.ok) {
            setError(null)
            setSuccessMsg(json.msg)
            setRemoveAfterClose(true)
        }

        setShowMsg(true)
    }

    const deleteTrip = async () => {

        const response = await fetch('api/manageTrips/deleteTrip', {
            method: 'DELETE',
            body: JSON.stringify({ adventureCanvas_id: adventureCanvase._id }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setSuccessMsg(null)
        }

        if (response.ok) {
            setError(null)
            setSuccessMsg(json.msg)
            setRemoveAfterClose(false)
        }

        setShowMsg(true)
    }

    return(
        <section className='adventureCanvase-section'>
            <Card className='adminManageAAdventureCanvase-card'>
                <Card.Body>
                    <Card.Title>{adventureCanvase.tripName} | {adventureCanvase.duration} Day/s | Cost: {adventureCanvase.cost}$</Card.Title>
                    <Card.Text className='scroll-custom-adminManageAAdventureCanvase'>{adventureCanvase.description}</Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                    { type==='unpublished' && 
                        <>
                            <Button variant="primary" onClick={publishTrip}>Publish Trip</Button> 
                            <label>Assign a tour operator for the trip:</label>
                            <select onChange={(e) => setAssignTourOperator(tourOperators[e.target.value])}>
                                <option value="" disabled selected>Select a tour operator</option>
                                { tourOperators.map((tourOperator, idx) => (
                                    <option key={idx} value={idx}>
                                        {`${tourOperator.username} (${tourOperator.email})`}
                                    </option>
                                ))}
                            </select>
                            <Button variant="danger" onClick={deleteTrip}>Delete Trip</Button>
                        </>
                    }
                    <Link onClick={setAdminManageAdventureCanvase} to="/tripPlan">Read More</Link>
                </Card.Footer>
            </Card>

            <Modal show={showMsg} onHide={handleCloseMsg} animation={false} centered>
                <Modal.Body className={'createATrip-Modal' && error ? 'errorMsg' : 'successMsg'}>
                    { error && <ErrorMsg msg={error}/> }
                    { success &&  <SuccessMsg msg={success}/> }
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <button onClick={handleCloseMsg}>Close</button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default AdminManageAdventureCanvase