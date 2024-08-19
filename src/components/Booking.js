
const Booking = ({ bookTrip }) => {
    return (
        <section className='booking-container'>
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