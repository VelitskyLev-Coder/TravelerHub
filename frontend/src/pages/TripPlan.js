import { useEffect, useState } from 'react'
import { Carousel, Accordion, Badge, Modal, Button, Spinner } from 'react-bootstrap'

// components
import ErrorMsg from '../components/ErrorMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const ADMIN_ROLE = 'admin'
const TRAVELER_ROLE = 'traveler'

const TripPlan = () => {
    const {user} = useAuthContext()
    const { currAdventureCanvases } = useCurrAdventureCanvaseContext()

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tripPlan, setTripPlan] = useState(null)

    const [booking, setBooking] = useState({
        tripName: currAdventureCanvases.tripName,
        duration: currAdventureCanvases.duration,
        startDate: '',
        endDate: '',
        date_id: '',
        member: 1,
        totalCost: 0
    })

    const [payment, setPayment] = useState({
        method: '',
        cardHolder: '',
        cardNumber: null,
        expirationDate: '',
        cvv: null
    })

    const handlePaymentInput = (e) => {
        const { name, value } = e.target
        setPayment({ ...payment, [name]: value })
    }

    const [showMsgAfterPayment, setShowMsgAfterPayment] = useState(false)
    const handleCloseMsgAfterPayment = () => setShowMsgAfterPayment(false)
    const handleShowMsgAfterPayment = () => {
        setShowPayment(false)
        setShowMsgAfterPayment(true)
    }

    const [selectedDate, setSelectedDate] = useState(null)

    const [showPayment, setShowPayment] = useState(false)
    const handleClosePayment = () => {
        setShowPayment(false)
        setError(null)
        setMembers(1)
    }    

    const handleShowPayment = (date) => {
        setSelectedDate(date)
        setBooking(prevBooking => ({
            ...prevBooking,
            startDate: date.starting,
            endDate: date.ending,
            date_id: date._id
        }))
        setMembers(1)
        setShowPayment(true)
        calculateTotalCost()
    }

    const [members, setMembers] = useState(1)
    const [totalCost, setTotalCost] = useState(currAdventureCanvases.cost * members)

    const handleMemberChange = (event) => {
        const newMembers = parseInt(event.target.value)
        setMembers(newMembers)
        setBooking(prevBooking => ({...prevBooking, member: newMembers}))
    }

    const calculateTotalCost = () => {
        const newTotalCost = currAdventureCanvases.cost * members
        setTotalCost(newTotalCost)
        setBooking(prevBooking => ({
            ...prevBooking,
            totalCost: newTotalCost
        }))
    }

    useEffect(() => {
        // Calculate total cost whenever members change
        calculateTotalCost()
    // eslint-disable-next-line
    }, [members])
    
    useEffect(() => {  
        const fetchTripPlan = async () => {
            setIsLoading(true)
            const response = await fetch(`/api/adventureCanvas/getTripPlanByAdventureCanvasId/${currAdventureCanvases._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setTripPlan(json)
                setIsLoading(false)
            }

            if (!response.ok) {
                setError(json.error)
            }
        }

        user && currAdventureCanvases && fetchTripPlan()
    }, [user, currAdventureCanvases])

    const isValidExpirationDate = (date) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Matches MM/YY format
        return regex.test(date)
    }

    const saveBooking = async () => {
        setError(null)
        
        if (booking.member < 1) {
            setError('Please fill in all the required fields')
            return
        }

        if (payment.method.trim() === '' || payment.cardHolder.trim() === '' || 
            payment.expirationDate.trim() === '' || payment.cardNumber === null || payment.cvv === null) {
            setError('Please fill in all the required fields')
            return 
        }

        if (!/^\d{16}$/.test(payment.cardNumber) || !/^\d{3}$/.test(payment.cvv)) {
            setError('The card number or cvv are not valid')
            return 
        }

        if (!isValidExpirationDate(payment.expirationDate)) {
            setError('The expiration date is not valid')
            return 
        }

        if (booking.member+selectedDate.currBooking > selectedDate.limitBooking) {
            setError(`There are only ${selectedDate.limitBooking-selectedDate.currBooking} places left for this trip. 
                Please reduce the number of people in your booking or try booking for a different date.`)
            return 
        }

        setIsLoading(true)

        const response = await fetch('/api/booking/saveBooking/', {
            method: 'POST',
            body: JSON.stringify({ booking, payment, adventureCanvas_id: currAdventureCanvases._id, date_id: selectedDate._id }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            handleShowMsgAfterPayment()
            setError(null)
            setIsLoading(false)
            setPayment ({
                method: '',
                cardHolder: '',
                cardNumber: null,
                expirationDate: '',
                cvv: null
            })
        }

        if (!response.ok) {
            setError(json.error)
        }
    
    }

    const handleConfirmation = async (date) => {
        setSelectedDate(date)

        const response = await fetch('api/manageTrips/updateConfirmedDate', {
            method: 'PATCH',
            body: JSON.stringify({ trip_id: tripPlan._id, date_id: date._id }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            // Update the local tripPlan state to reflect the change
            setTripPlan(prevTripPlan => {
                const updatedDates = prevTripPlan.dates.map(d => 
                    d._id === date._id ? { ...d, executionConfirmed: !d.executionConfirmed } : d
                )
                return { ...prevTripPlan, dates: updatedDates }
            })
            setError(null)
        }

        if (!response.ok) {
            setError(json.error)
        }
    }

    // Render Loading spinner if currAdventureCanvases is null
    if (!currAdventureCanvases) {
        return (
            <div className='no-result-label'>
                <Spinner animation="border" role="status"></Spinner>
                <span>Loading...</span>
            </div>
        )
    }

    return (
        <section className='tripPlan-section'>

            { error &&  <ErrorMsg msg={error}/> }

            { isLoading && 
                <div className='no-result-label'>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>Loading...</span>
                </div>
            }

            <div className='tripPlan-img-div'>
                <Carousel slide={false} interval={null}>
                    {currAdventureCanvases.images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100" src={image} alt={`Slide ${index}`}/>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
            
            <label className='tripPlan-large-label tripPlan-siteName'>{currAdventureCanvases.tripName}</label>

            <label className='tripPlan-duration-cost-label'>{currAdventureCanvases.duration} Days | {currAdventureCanvases.cost}$ per person</label>

            <p className='tripPlan-info-p-and-travelGuide-div'>{currAdventureCanvases.description}</p>

            <label className='tripPlan-large-label tripPlan-sub-title'>Itinerary</label>
            {tripPlan && tripPlan.scheduled.map((scheduledItem, index) => (
                <Accordion key={index} className='tripPlan-scheduledItem-accordion'>
                    <Accordion.Item eventKey={index}>
                        <Accordion.Header>Day {scheduledItem.day}:{' ' + scheduledItem.location}</Accordion.Header>
                        <Accordion.Body>{scheduledItem.description}</Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ))}

            <label className='tripPlan-large-label tripPlan-sub-title'>Dates</label>
            <table className='tripPlan-dates-table'>
                <tbody>
                    <tr>
                        <th>Starting</th>
                        <th>Ending</th>
                        <th>Status</th>
                        {/* colume for booking */}
                        { user.userType === TRAVELER_ROLE && 
                            <th></th>
                        }
                        {/* colums for confirmation */}
                        { user.userType !== TRAVELER_ROLE && 
                            <>
                                <th></th> 
                                <th>Confirmation</th>
                            </>
                        }
                        { user.userType === ADMIN_ROLE && 
                            <th></th>
                        }
                    </tr>

                    {tripPlan && tripPlan.dates.map((date, index) => (
                        <tr key={index}>
                            <td>{date.starting}</td>
                            <td>{date.ending}</td>
                            <td>
                                {date.currBooking >= date.limitBooking ? <Badge pill bg='danger'>Fully booked</Badge> : 
                                    new Date() > new Date(date.starting) ? <Badge pill bg='danger'>Not Available</Badge> :
                                    <Badge pill bg='success'>Available</Badge>}
                            </td>
                            { user.userType === TRAVELER_ROLE && 
                                <td>
                                    <button 
                                        onClick={() => handleShowPayment(date)}
                                        className='tripPlan-booking-btn' 
                                        disabled={date.currBooking >= date.limitBooking ? true : 
                                            new Date() > new Date(date.starting) ? true :
                                            false}>
                                            Booking
                                    </button>
                                </td>
                            }
                            { user.userType !== TRAVELER_ROLE && 
                                <>
                                    <td>Booked {date.currBooking} out of {date.limitBooking}</td> 
                                    <td>
                                        { date.executionConfirmed === true ? 
                                            <Badge pill bg='success'>Date Confirmed</Badge> :
                                            <Badge pill bg='danger'>Wait for Confirmation</Badge>
                                        }
                                    </td>
                                </>
                            }
                            { user.userType === ADMIN_ROLE && 
                                <td>
                                    <button 
                                        onClick={() => handleConfirmation(date)}
                                        className='tripPlan-booking-btn' 
                                        disabled={date.currBooking > date.limitBooking ? true : 
                                            new Date() > new Date(date.starting) ? true :
                                            false}>
                                            {date.executionConfirmed === true ? 'Unconfirmed' : 'Confirmed'}
                                    </button>
                                    
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>

            <label className='tripPlan-large-label tripPlan-sub-title'>Tour Operator</label>
            {currAdventureCanvases.assignTourOperator && 
                <div className='tripPlan-tourOperator'>
                    <img src={currAdventureCanvases.assignTourOperator.photo} alt=''/>
                    {currAdventureCanvases.assignTourOperator.username}
                </div>
            }
            {!currAdventureCanvases.assignTourOperator && 
                <p>Tour operator need to be assigned</p>
            }

            <label className='tripPlan-large-label tripPlan-sub-title'>Travel Guide</label>
            <div className='tripPlan-info-p-and-travelGuide-div'> 
                {tripPlan && tripPlan.travelGuide!=='' ? tripPlan.travelGuide : 'No Travel Guide has been added for this trip.'}
            </div> 

            {/* pop-up modal for payment */}
            <Modal className='tripPlan-modal-payment' size='lg' show={showPayment} onHide={handleClosePayment} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Payment</Modal.Title><br/>
                </Modal.Header>
                <Modal.Body className='modal-payment-body'>
                    <div className='modal-payment-inputs'>
                        <p>*All fields are required</p>
                        <b>Choose your payment method</b>
                        <label className='modal-payment-radio'>
                            <input type="radio" name='method' value='Mastercard' onChange={handlePaymentInput}/>
                            Mastercard <img src='./images/Mastercard_logo.png' alt=''/>
                        </label>
                        <label className='modal-payment-radio'>
                            <input type="radio" name='method' value='Visa' onChange={handlePaymentInput}/>
                            Visa <img src='./images/Visa_logo.png' alt=''/>
                        </label>
                        
                        <label>Card holder name</label>
                        <input name='cardHolder' value={payment.cardHolder} 
                                onChange={handlePaymentInput} placeholder='Your name'/>

                        <label>Card number</label>
                        <input name='cardNumber' value={payment.cardNumber} 
                                onChange={handlePaymentInput} type='number' placeholder='xxxx xxxx xxxx xxxx'/>

                        <label>Expiration date</label>
                        <input name='expirationDate' value={payment.expirationDate} 
                                onChange={handlePaymentInput} placeholder='MM/YY'/>

                        <label>CVV</label>
                        <input name='cvv' value={payment.cvv}  
                                onChange={handlePaymentInput} type='number' placeholder='xxx'/>

                        <label>Member/s</label>
                        <input type='number' placeholder='1' min='1' max='' onChange={handleMemberChange}/>
                    </div>

                    <div className='modal-payment-reception'>
                        <label><b>Trip name:</b> {currAdventureCanvases.tripName}</label>
                        <label><b>Date:</b> {selectedDate ? `${selectedDate.starting} - ${selectedDate.ending}` : ''}</label>
                        <label><b>Duration:</b> {currAdventureCanvases.duration}</label>
                        <label><b>Member/s:</b> {members}</label>
                        <label><b>Total cost:</b> {totalCost}$</label>

                        <button onClick={saveBooking}>Pay</button>

                        { error &&  <ErrorMsg msg={error}/> }
                    </div>
                </Modal.Body>
            </Modal>

            {/* pop-up modal for the msg after payment */}
            <Modal show={showMsgAfterPayment} onHide={handleCloseMsgAfterPayment} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Payment made successfuly.<br/>
                    Have a great Trip :) <br/><br/>
                    You can watch your booking details in the 'My Booking' section.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMsgAfterPayment}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default TripPlan