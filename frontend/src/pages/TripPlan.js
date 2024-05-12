import { useState } from 'react'
import { Carousel, Accordion, Badge, Modal, Button } from 'react-bootstrap'

const tripPlan = {
    images: ['./images/image-usa-1.jpg', './images/image-usa-2.jpg', './images/image-usa-3.jpg'],
    siteName: "Charleston, USA",
    durantion: '5 Days',
    cost: '3320$',
    info: `Welcome to our exciting trip to Charleston, South Carolina! Over the next five days, we will immerse ourselves in the rich history, 
    vibrant culture, and stunning natural beauty of this charming city. Our journey begins with a leisurely exploration of historic downtown 
    Charleston, where we will visit iconic sites such as The Battery, White Point Garden, and Rainbow Row. We will also indulge in delicious 
    Lowcountry cuisine at local eateries and explore the bustling Charleston City Market.`,
    scheduledItems: [
        {day: '1', siteName: 'Exploring Historic Downtown Charleston', decription: "Begin your trip in historic downtown Charleston, South Carolina, immersing yourself in the city's rich history and charm. Wander through The Battery and White Point Garden, soaking in views of Charleston Harbor and the beautifully preserved antebellum homes. Enjoy a traditional Southern lunch at Poogan's Porch before exploring the bustling Charleston City Market, where local artisans showcase their crafts. End your day with a leisurely walk along Rainbow Row and a visit to Waterfront Park, where you can relax by the iconic Pineapple Fountain." },
        {day: '2', siteName: 'Plantations and Gardens Tour', decription: "Embark on a tour of Charleston's plantations and gardens, starting with Magnolia Plantation and Gardens. Explore the stunning gardens, wildlife, and historic plantation house. Enjoy a box lunch at Middleton Place before wandering through its landscaped gardens and stable yards. Conclude your day at the Charleston Tea Garden, where you can learn about the art of tea-making and sample some of their unique blends." },
        {day: '3-4', siteName: 'Beach Day at Isle of Palms', decription: "Escape to the pristine shores of Isle of Palms for a relaxing beach day. Swim in the Atlantic Ocean, sunbathe on the sandy beach, or take a leisurely walk along the coast. Enjoy a seafood lunch at The Boathouse at Breach Inlet before indulging in water activities like kayaking or paddleboarding. End your day with a picturesque sunset beach walk, savoring the beauty of the ocean at dusk." },
        {day: '5', siteName: 'Departure from Charleston', decription: "On your final day, enjoy a delicious Southern breakfast at Hominy Grill, savoring the flavors of Charleston one last time. Bid farewell to this charming city as you head to Charleston International Airport, taking with you memories of a fantastic trip exploring the history, culture, and natural beauty of Charleston, South Carolina." }
    ],
    dates: [
        {starting: '02/05/2024', ending: '06/05/2024', booking: 25, limitBooking: 25},
        {starting: '12/05/2024', ending: '16/05/2024', booking: 10, limitBooking: 20},
        {starting: '20/07/2024', ending: '24/07/2024', booking: 21, limitBooking: 30},
        {starting: '01/01/2025', ending: '04/01/2025', booking: 6, limitBooking: 25}
    ],
    travelGuide: [
        "Comfortable walking shoes are a must, as we will be exploring Charleston's historic streets and plantations.",
        "Lightweight and breathable clothing is recommended, as Charleston can be quite warm and humid, especially in the summer months.",
        "A light jacket or sweater may be needed for cooler evenings or indoor venues with air conditioning.",
        "Charleston has a humid subtropical climate, with mild winters and hot, humid summers.",
        "Have fun and enjoy your time in Charleston!"
    ]
}

const TripPlan = () => {

    const [showMsgAfterPayment, setShowMsgAfterPayment] = useState(false)
    const handleCloseMsgAfterPayment = () => setShowMsgAfterPayment(false)
    const handleShowMsgAfterPayment = () => {
        setShowPayment(false)
        setShowMsgAfterPayment(true)
    }

    const [selectedDate, setSelectedDate] = useState(null)

    const [showPayment, setShowPayment] = useState(false)
    const handleClosePayment = () => setShowPayment(false)
    // const handleShowPayment = () => setShowPayment(true)
    const handleShowPayment = (date) => {
        setSelectedDate(date)
        setShowPayment(true)
    }

    const [members, setMembers] = useState(0)

    const handleMemberChange = (event) => {
        const newMembers = parseInt(event.target.value)
        setMembers(newMembers)
    }

    const calculateTotalCost = () => {
        const costPerPerson = parseFloat(tripPlan.cost.replace('$', ''))
        return (costPerPerson * members).toFixed(2)
    }

    return (
        <section className='tripPlan-section'>
            <div className='tripPlan-img-div'>
                <Carousel slide={false} interval={null}>
                    {tripPlan.images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100" src={image} alt={`Slide ${index}`}/>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <label className='tripPlan-large-label tripPlan-siteName'>{tripPlan.siteName}</label>

            <label className='tripPlan-duration-cost-label'>{tripPlan.durantion} | {tripPlan.cost} per person</label>

            <p className='tripPlan-info-p-and-travelGuide-div'>{tripPlan.info}</p>

            <label className='tripPlan-large-label tripPlan-sub-title'>Itinerary</label>
            {tripPlan.scheduledItems.map((scheduledItem, index) => (
                <Accordion key={index} className='tripPlan-scheduledItem-accordion'>
                    <Accordion.Item eventKey={index}>
                        <Accordion.Header>Day {scheduledItem.day}:{' ' + scheduledItem.siteName}</Accordion.Header>
                        <Accordion.Body>{scheduledItem.decription}</Accordion.Body>
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
                        <th></th>
                    </tr>

                    {tripPlan.dates.map((date, index) => (
                        <tr key={index}>
                            <td>{date.starting}</td>
                            <td>{date.ending}</td>
                            <td>
                                { date.booking<date.limitBooking ? 
                                    <Badge pill bg='success'>Available</Badge> : <Badge pill bg='danger' >Fully booked</Badge>
                                }
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleShowPayment(date)}
                                    className='tripPlan-booking-btn' 
                                    disabled={date.booking<date.limitBooking ? false : true}>
                                        Booking
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <label className='tripPlan-large-label tripPlan-sub-title'>Travel Guide</label>
            <div className='tripPlan-info-p-and-travelGuide-div'>
                {tripPlan.travelGuide.map((travelGuide, index) => (
                    <p key={index}>{index+1}. {travelGuide}</p>
                ))}
            </div>


            {/* pop-up modal for payment */}
            <Modal className='tripPlan-modal-payment' size='lg' show={showPayment} onHide={handleClosePayment} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-payment-body'>
                    <div className='modal-payment-inputs'>
                        <b>Choose your payment method</b>
                        <label className='modal-payment-radio'>
                            <input type="radio" name="paymentMethod" value="Mastercard" />
                            Mastercard <img src='./images/Mastercard_logo.png' alt=''/>
                        </label>
                        <label className='modal-payment-radio'>
                            <input type="radio" name="paymentMethod" value="Visa" />
                            Visa <img src='./images/Visa_logo.png' alt=''/>
                        </label>
                        
                        <label>Card holder name</label>
                        <input placeholder='Your name'></input>

                        <label>Card number</label>
                        <input type='number' placeholder='xxxx xxxx xxxx xxxx'></input>

                        <label>Expiration date</label>
                        <input placeholder='MM/YY'></input>

                        <label>CVC</label>
                        <input type='number' placeholder='xxx'></input>

                        <label>Member/s</label>
                        <input type='number' placeholder='0' min='1' onChange={handleMemberChange}></input>
                    </div>

                    <div className='modal-payment-reception'>
                        <label><b>Trip name:</b> {tripPlan.siteName}</label>
                        <label><b>Date:</b> {selectedDate ? `${selectedDate.starting} - ${selectedDate.ending}` : ''}</label>
                        <label><b>Duration:</b> {tripPlan.durantion}</label>
                        <label><b>Member/s:</b> {members}</label>
                        <label><b>Total cost:</b> {calculateTotalCost()}$</label>

                        <button onClick={handleShowMsgAfterPayment}>Pay</button>
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