// import { Card } from "react-bootstrap"

const Booking = ({ bookTrip }) => {
    return (
        <section className='booking-container'>
            {/* <Card className='booking-card'>
                <Card.Header>{bookTrip.tripName} | {bookTrip.duration} Days | {bookTrip.starting} - {bookTrip.ending}</Card.Header>
                <Card.Body>Total cost: {bookTrip.cost} for {bookTrip.amount} member/s</Card.Body>
                <Card.Footer className='d-flex justify-content-between'>
                    <a href='/tripPlan'>View Trip Plan</a>
                    <button>Cancel Booking</button>
                </Card.Footer>
            </Card> */}


            <td>{bookTrip.tripName}</td>
            <td>{bookTrip.duration}</td>
            <td>{bookTrip.starting}</td>
            <td>{bookTrip.ending}</td>
            <td>{bookTrip.amount}</td>
            <td>{bookTrip.cost}</td>
            <td><a href='/tripPlan'>View Trip Plan</a></td>
            <td><button>Cancel Booking</button></td>
        </section>
    )
}

export default Booking