import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react';

// components
import Forum from './Forum'
import Review from './Review'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const MyTripAdventureCanvase = ({ idx, adventureCanvas }) => {

    const { user } = useAuthContext()
    const { dispatch } = useCurrAdventureCanvaseContext()

    const [error, setError] = useState(null)
    const [forumShow, setForumShow] = useState(false);
    const [reviews, setReviews] = useState([])

    const [showReviews, setShowReviews] = useState(false)
    const handleCloseReviews = () => setShowReviews(false)
    const handleShowReviews = () => setShowReviews(true)

    const setAdventureCanvas = () => {
        localStorage.setItem('currAdventureCanvases', JSON.stringify(adventureCanvas)); // Save to local storage
        dispatch({type: 'SET_CURRENT_ADVENTURE_CANVASES', payload: adventureCanvas})
    }

    const handleReviewBtn = async () => {
        try {
            const response = await fetch(`/api/review/getReviewByAdventureCanvasesId/${adventureCanvas._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setError(null)
                setReviews(json)                
                // setIsLoading(false)
            }

            if (!response.ok) {
                setError(json.error)
                setReviews([])
            }
        } catch (error) {
            setError(error.message)
        }

        handleShowReviews()
    }

    return(
        <>
            <tr key={idx}>
                <td>{adventureCanvas.tripName}</td>
                <td>{adventureCanvas.duration} Days</td>
                <td><Button variant="primary" onClick={() => setForumShow(true)}>Open Form</Button></td>
                <td><Link className='adventureCanvase-link' onClick={handleReviewBtn}>Reviews</Link></td>
                <td><Link className='adventureCanvase-link' onClick={setAdventureCanvas} to="/tripPlan">Trip Plan Details</Link></td>
            </tr>

            <Forum forumtitle={adventureCanvas.tripName} adventureCanvase_id={adventureCanvas._id} 
                    show={forumShow} onHide={() => setForumShow(false)}/>

            {/* pop-up modal for the cancel booking */}
            <Modal size="lg" show={showReviews} onHide={handleCloseReviews} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{adventureCanvas.tripName} - Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body className='review-modal-body scroll-custom-forum'>
                    { reviews.length === 0 && 
                        <label>{error}</label>
                    }
                    { reviews.length > 0 && 
                        reviews.map((review, idx) => (
                            <Review review={review} key={idx}/>
                        ))
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReviews}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MyTripAdventureCanvase