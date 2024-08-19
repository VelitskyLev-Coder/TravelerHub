import { useState, useEffect } from 'react'
import { Spinner, Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// components
import ErrorMsg from '../components/ErrorMsg'
import Review from '../components/Review'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'

const CustomerReviews = () => {
    const {user} = useAuthContext()
    const [tourOperators, setTourOperators] = useState([])

    const [tourOperatorError, setTorOperatorError] = useState(null)
    const [reviewsError, setReviewError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [reviews, setReviews] = useState([])

    const [showReviews, setShowReviews] = useState(false)
    const handleCloseReviews = () => setShowReviews(false)
    const handleShowReviews = () => setShowReviews(true)

    useEffect(() => { 
        setIsLoading(true)
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
                setTorOperatorError(null)
                setIsLoading(false)
            }

            if (!response.ok) {
                setTourOperators([json.error])
                setTorOperatorError(json.error)
                setIsLoading(false)
            }
        }

        user && fetchTourOperators()
    }, [user])

    const handleReviewBtn = async (tourOperator_email) => {
        try {
            const response = await fetch(`/api/review/getReviewByTourOperatorEmail/${tourOperator_email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setReviewError(null)
                setReviews(json)                
            }

            if (!response.ok) {
                setReviewError(json.error)
                setReviews([])
            }
        } catch (error) {
            setReviewError(error.message)
        }

        handleShowReviews()
    }

    return(
        <section className='background'>

            { isLoading && 
                <div className='no-result-label'>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>Loading...</span>
                </div>
            }

            <table className='mybooking-table'>
                <tbody>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Reviews</th>
                    </tr>

                    { !isLoading && tourOperators.length === 0 && tourOperatorError &&
                        <ErrorMsg msg={tourOperatorError}/>
                    }

                    { !isLoading && tourOperators.length > 0 &&
                        tourOperators.map((tourOperator, idx) => (
                            <tr key={idx}>
                                <td><img className='review-photo' src={tourOperator.photo} alt=''/></td>
                                <td>{tourOperator.username}</td>
                                <td>{tourOperator.email}</td>
                                <td>
                                    <Link className='adventureCanvase-link' onClick={() => handleReviewBtn(tourOperator.email)}>Reviews</Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* pop-up modal for the cancel booking */}
            <Modal size="lg" show={showReviews} onHide={handleCloseReviews} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body className='review-modal-body scroll-custom-forum'>
                    { reviews.length === 0 && 
                        <label>{reviewsError}</label>
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
        </section>
    )
}

export default CustomerReviews