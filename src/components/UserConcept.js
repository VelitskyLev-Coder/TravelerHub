import { Card, Badge, Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import ErrorMsg from '../components/ErrorMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const UserConcept = ({ userConcept, removeDeletedConcept }) => {
    const {user} = useAuthContext()
    const {dispatch} = useCurrAdventureCanvaseContext()
    const navigate = useNavigate()

    const [showPromotionConfirmation, setShowPromotionConfirmation] = useState(false)
    const handleClosePromotionConfirmation = () => setShowPromotionConfirmation(false)
    const handleShowPromotionConfirmation = () => setShowPromotionConfirmation(true)

    const [error, setError] = useState(null)
    const [isClicked, setIsClicked] = useState(false)

    // Define CSS classes based on the state
    const likeIconClassName = isClicked ? 'like' : 'unlike'

    useEffect(() => {
        if (userConcept.likes.includes(user.email)) {
            setIsClicked(true)
        } else {
            setIsClicked(false)
        } 
    }, [userConcept.likes, user.email])

    const handleLikeBtn = async () => {
        let response
        if (isClicked) {
            response = await fetch('api/concept/updateLike/', {
                method: 'PATCH',
                body: JSON.stringify({ concept_id: userConcept._id, email: user.email, likeStatus: 'unlike' }),
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
        } else {
            response = await fetch('api/concept/updateLike/', {
                method: 'PATCH',
                body: JSON.stringify({ concept_id: userConcept._id, email: user.email, likeStatus: 'like' }),
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
        }
        const json = await response.json()

        if (response.ok) {
            setError(null)
            userConcept.likes = json
        }
        if (!response.ok) {
            setError(json.error)
        }
        setIsClicked(!isClicked)
    }

    const handlePromoteBtn = async () => {
        const adventureCanvase = {
            tripName: userConcept.tripName,
            description: userConcept.description,
            duration: userConcept.duration
        }
        dispatch({type: 'SET_CURRENT_ADVENTURE_CANVASES', payload: adventureCanvase})

        navigate('/createTrip', {
            state: { fromConcept: true }  // Pass a state indicating the origin
        })
    }

    const handleDeleteConcept = async () => {
        setError(null)

        const response = await fetch('/api/concept/deleteConcept/', {
            method: 'DELETE',
            body: JSON.stringify({ concept_id: userConcept._id }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            setError(null)
            removeDeletedConcept(userConcept._id)
        }

        if (!response.ok) {
            setError(json.error)
        }
    }

    return(
        <section className='userConcept-section'>
        
            { error &&  <ErrorMsg msg={error}/> }

            <Card className='concept-card'>
                <Card.Body>
                    <Card.Title>{userConcept.tripName} | {userConcept.duration} days</Card.Title>
                    <Card.Text className='userConcept-info-scroll-custom'>{userConcept.description}</Card.Text>
                </Card.Body>
                <Card.Footer className='userConcept-card-footer'>
                    <button className={likeIconClassName} onClick={handleLikeBtn}>
                        <FontAwesomeIcon icon={faThumbsUp} /> <Badge bg="secondary">{userConcept.likes.length}</Badge>
                    </button>
                    <label>interested travelers</label><br/>
                </Card.Footer>
                { user.userType !== 'traveler' &&
                    <Card.Footer className='userConcept-card-footer-tourOperator'>
                        <button className='userConcept-promote-btn' onClick={handleShowPromotionConfirmation}>Promote Concept</button>
                        <button className='userConcept-trash-btn' onClick={handleDeleteConcept}><i className='fa fa-trash'></i></button>
                    </Card.Footer>
                }
            </Card>

            {/* pop-up modal for confirmation before promoting concept */}
            <Modal show={showPromotionConfirmation} onHide={handleClosePromotionConfirmation} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Promotion Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Note that by clicking on the <b>'Promote'</b> button, you will be directed 
                    to the 'Create a Trip' page to edit the rest of the trip plan details. 
                    <br/>All the necessary Concept data will be transferred automatically. 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePromotionConfirmation}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handlePromoteBtn}>
                        Promote
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default UserConcept