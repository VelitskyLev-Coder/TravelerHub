import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const bookings = [
    {tripName: 'Colombia', duration: 3, starting: '01/11/2024', ending: '07/11/2024', amount: 6, cost: '7070$'},
    {tripName: 'Charleston, USA', duration: 5, starting: '02/05/2024', ending: '06/05/2024', amount: 2, cost: '6520$'}
]

// const pastBookings = [
//     {tripName: 'Greece', duration: 4, starting: '01/02/2023', ending: '07/02/2023', amount: 6, cost: '7070$'},
//     {tripName: 'Cyprus', duration: 5, starting: '02/05/2022', ending: '06/05/2022', amount: 2, cost: '6520$'}
// ]

const MyBooking = () => {

    const [showCancelBooking, setShowCancelBooking] = useState(false)
    const handleCloseCancelBooking = () => setShowCancelBooking(false)
    const handleShowCancelBooking = () => setShowCancelBooking(true)

    return (
        <section className='mybooking-container'>
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
                    </tr>

                
                    {bookings.map((bookTrip, idx) => (
                        <tr key={idx}>
                            <td>{bookTrip.tripName}</td>
                            <td>{bookTrip.duration}</td>
                            <td>{bookTrip.starting}</td>
                            <td>{bookTrip.ending}</td>
                            <td>{bookTrip.amount}</td>
                            <td>{bookTrip.cost}</td>
                            <td><a href='/tripPlan'>View Trip Plan</a></td>
                            <td><button onClick={handleShowCancelBooking}>Cancel Booking</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                    <Button variant="danger" onClick={handleCloseCancelBooking}>
                        Cancel Booking
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default MyBooking