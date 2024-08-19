import { useState, useEffect } from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

// components
import ErrorMsg from '../components/ErrorMsg'
import SuccessMsg from '../components/SuccessMsg'
import StarRating from '../components/StarRating'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const MyBooking = () => {
    const {user} = useAuthContext()
    const {dispatch} = useCurrAdventureCanvaseContext()
    const navigate = useNavigate();

    const [error, setError] = useState(null)
    const [success, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])
    const [currBooking, setCurrBooking] = useState()

    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')
    const [adventureCanvas_id, setAdventureCanvas_id] = useState(null)
    const [errorReview, setErrorReview] = useState(null)

    const [showReviewSection, setShowReviewSection] = useState(false)
    const handleCloseReviewSection = () => setShowReviewSection(false)
    const handleShowReviewSection = (Curr_adventureCanvas_id) => {
        setRating(0)
        setContent('')
        setErrorReview(null)
        setSuccessMsg(null)
        setShowReviewSection(true)
        setAdventureCanvas_id(Curr_adventureCanvas_id)
    }

    const [showCancelBooking, setShowCancelBooking] = useState(false)
    const handleCloseCancelBooking = () => setShowCancelBooking(false)
    const handleShowCancelBooking = (bookTrip) => {
        setCurrBooking(bookTrip)
        setShowCancelBooking(true)
    }

    useEffect(() => { 
        setIsLoading(true)

        const fetchBooking = async () => {

            try {
                const response = await fetch('/api/booking/getBookingForUser/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const json = await response.json()

                if (response.ok) {
                    setBookings(json)
                    setIsLoading(false)
                }

                if (!response.ok) {
                    setSuccessMsg(null)
                    setError(json.error)
                }
            } catch (error) {
                setError(error.message)
            }
        }

        user && fetchBooking()
    }, [user])

    const setAdventureCanvase = async (adventureCanvase_id) => {
        setError(null)
        setSuccessMsg(null)
        setIsLoading(true)

        const response = await fetch(`/api/adventureCanvas/getAdventureCanvasById/${adventureCanvase_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            localStorage.setItem('currAdventureCanvases', JSON.stringify(json)); // Save to local storage
            dispatch({type: 'SET_CURRENT_ADVENTURE_CANVASES', payload: json})
            setIsLoading(false)
            navigate('/tripPlan')
        }

        if (!response.ok) {
            setSuccessMsg(null)
            setError(json.error)
            setIsLoading(false)
        }
    }

    const deleteBooking = async () => {
        setError(null)
        setSuccessMsg(null)
        setIsLoading(true)

        const response = await fetch('/api/booking/deleteBooking/', {
            method: 'DELETE',
            body: JSON.stringify({ currBooking }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            setSuccessMsg(json.msg)
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== currBooking._id))
            setIsLoading(false)
            handleCloseCancelBooking()
        }

        if (!response.ok) {
            setError(json.error)
            setIsLoading(false)
        }
    }

    const hasStartDatePassed = (startDate) => {
        const currentDate = new Date();
        const bookingDate = new Date(startDate);
        return bookingDate < currentDate;
    }
    
    const submitReview = async () => {
        if (content.trim() === '') {
            setErrorReview('Must contain content.')
            return
        }

        const response = await fetch('/api/review/addReview/', {
            method: 'POST',
            body: JSON.stringify({ travelerName: user.username, travelerPhoto: user.photo, rating, content, adventureCanvas_id }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            setErrorReview(null)
            setSuccessMsg(json.msg)
            handleCloseReviewSection()
        }

        if (!response.ok) {
            setSuccessMsg(null)
            setErrorReview(json.error)
        }   
    }

    return (
        <section className='mybooking-container'>

            { isLoading && 
                <div className='no-result-label'>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>Loading...</span>
                </div>
            }

            { !isLoading && bookings.length !== 0 && 
                <table className='mybooking-table'>
                    <tbody>
                        <tr>
                            <th>Trip name</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Members</th>
                            <th>Total cost</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>

                    
                        {bookings.map((bookTrip, idx) => (
                            <tr key={idx}>
                                <td>{bookTrip.tripName}</td>
                                <td>{bookTrip.duration}</td>
                                <td>{bookTrip.startDate}</td>
                                <td>{bookTrip.endDate}</td>
                                <td>{bookTrip.member}</td>
                                <td>{bookTrip.totalCost}$</td>
                                <td><Link onClick={() => setAdventureCanvase(bookTrip.adventureCanvas_id)}>View Trip Plan</Link></td>
                                <td><Link onClick={() => handleShowReviewSection(bookTrip.adventureCanvas_id)}>Write a Review</Link></td>
                                <td><button disabled={hasStartDatePassed(bookTrip.startDate)}
                                            onClick={() => handleShowCancelBooking(bookTrip)}>
                                        Cancel Booking
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

            { error &&  <div className='center-page'><ErrorMsg msg={error}/></div> }
            { success &&  <div className='center-page'><SuccessMsg msg={success}/></div> }

            { !isLoading && bookings.length === 0 &&
                <label className='no-result-label'>
                    Your booking details will be displayed here.
                </label>
            }

            {/* pop-up modal for the cancel booking */}
            <Modal show={showCancelBooking} onHide={handleCloseCancelBooking} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Cancellation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel your booking?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCancelBooking}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => deleteBooking()}>
                        Cancel Booking
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* pop-up modal for sending review */}
            <Modal className='mybooking-reviwe-modal' show={showReviewSection} onHide={handleCloseReviewSection} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>We would like to hear your thoughts. <br/>How was your trip? How was your tour guide?</label>
                    <StarRating rating={rating} setRating={setRating} />
                    <textarea name='content' value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                    { errorReview &&  <div className='center-page'><ErrorMsg msg={errorReview}/></div> }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReviewSection}>
                        Close
                    </Button>
                    <Button variant="success" onClick={() => submitReview()}>
                        Send Review
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default MyBooking