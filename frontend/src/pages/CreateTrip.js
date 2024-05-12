import { Accordion, Col, Row } from 'react-bootstrap';

import ScheduledItem from '../components/ScheduledItem'
import TripDates from '../components/TripDates';

const scheduledItems = [
  {day: '1', siteName: 'Exploring Historic Downtown Charleston', decription: "Begin your trip in historic downtown Charleston, South Carolina, immersing yourself in the city's rich history and charm. Wander through The Battery and White Point Garden, soaking in views of Charleston Harbor and the beautifully preserved antebellum homes. Enjoy a traditional Southern lunch at Poogan's Porch before exploring the bustling Charleston City Market, where local artisans showcase their crafts. End your day with a leisurely walk along Rainbow Row and a visit to Waterfront Park, where you can relax by the iconic Pineapple Fountain." },
  {day: '2', siteName: 'Plantations and Gardens Tour', decription: "Embark on a tour of Charleston's plantations and gardens, starting with Magnolia Plantation and Gardens. Explore the stunning gardens, wildlife, and historic plantation house. Enjoy a box lunch at Middleton Place before wandering through its landscaped gardens and stable yards. Conclude your day at the Charleston Tea Garden, where you can learn about the art of tea-making and sample some of their unique blends." },
  {day: '3-4', siteName: 'Beach Day at Isle of Palms', decription: "Escape to the pristine shores of Isle of Palms for a relaxing beach day. Swim in the Atlantic Ocean, sunbathe on the sandy beach, or take a leisurely walk along the coast. Enjoy a seafood lunch at The Boathouse at Breach Inlet before indulging in water activities like kayaking or paddleboarding. End your day with a picturesque sunset beach walk, savoring the beauty of the ocean at dusk." },
  {day: '5', siteName: 'Departure from Charleston', decription: "On your final day, enjoy a delicious Southern breakfast at Hominy Grill, savoring the flavors of Charleston one last time. Bid farewell to this charming city as you head to Charleston International Airport, taking with you memories of a fantastic trip exploring the history, culture, and natural beauty of Charleston, South Carolina." }
]

const tripDates = [
  {starting: '02/05/2024', ending: '06/05/2024', limitBooking: 25},
  {starting: '12/05/2024', ending: '16/05/2024', limitBooking: 20},
  {starting: '20/07/2024', ending: '24/07/2024', limitBooking: 30},
  {starting: '01/01/2025', ending: '04/01/2025', limitBooking: 25}
]

const CreateTrip = () => {
  return (
      <section className='createATrip'>
        <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Adventure Canvas</Accordion.Header>
            <Accordion.Body className='adventureCanvas-createATrip'>
              <label>Upload images</label>
              <input type="file" id="imageUpload" accept="image/*" multiple></input>
              <input type='text' placeholder='Trip name*'></input>
              <textarea placeholder='Write the Adventure Canvas here...*'></textarea>
              <input type='text' placeholder='Duration*'></input>
              <input type='text' placeholder='Total cost*'></input>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Scheduled Items</Accordion.Header>
            <Accordion.Body className='scheduledItem-createATrip'>
              <Row>
                <Col className='p-0'>
                  <input type='text' placeholder='Site name / Location*'></input>
                  <label className='inline'>Day/s (of the trip):*</label>
                  <input className='input-days inline' type='text' placeholder='x-y'></input>
                  <input type='text' placeholder="Day's description*"></input>
                  <button className='createATrip-Add-btn'>Add</button>
                </Col>

                <Col className='p-0'>
                  <div xs={1} md={2} lg={3} className="card-scheduledItem-div scroll-custom">
                    {scheduledItems.map((scheduledItem, idx) => (
                        <div className='mb-3' key={idx}>
                            <ScheduledItem scheduledItem={scheduledItem} />
                        </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Dates</Accordion.Header>
            <Accordion.Body className='dates-createATrip'>
              <Row>
                <Col>
                  <label>Starting:*</label>
                  <input type='date'></input>
                  <label>Ending:*</label>
                  <input type='date'></input>
                  <label>Group size:*</label>
                  <input type='number' placeholder='0'></input>
                  <button className='createATrip-Add-btn'>Add</button>
                </Col>

                <Col className='p-0'>
                  <div xs={1} md={2} lg={3} className="card-scheduledItem-div scroll-custom">
                    {tripDates.map((tripDate, idx) => (
                        <div className='mb-3' key={idx}>
                            <TripDates tripDate={tripDate} />
                        </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>Add Travel Guide</Accordion.Header>
            <Accordion.Body className='travelGuide-createATrip'>
              <textarea placeholder='Notes for travelers...'></textarea>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <button className='createATrip-PublishTrip-btn'>Publish Trip</button>
      </section>
  )
}

export default CreateTrip