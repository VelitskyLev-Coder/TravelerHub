import { Accordion, Col, Row, Modal, Spinner } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// components
import ScheduledItem from '../components/ScheduledItem'
import TripDates from '../components/TripDates'
import ErrorMsg from '../components/ErrorMsg'
import SuccessMsg from '../components/SuccessMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'
import { useTripPlanContext } from '../hooks/useTripPlanContext'
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const CreateTrip = () => {

  const { user } = useAuthContext()
  const {dates, scheduled, dispatch} = useTripPlanContext()
  const {currAdventureCanvases} = useCurrAdventureCanvaseContext()

  const location = useLocation()

  const [error, setError] = useState(null)
  const [success, setSuccessMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const handleCloseErrorMsg = () => setShowErrorMsg(false)

  const [adventureCanvas, setAdventureCanvas] = useState({
    tripName: '',
    duration: null,
    description: '',
    cost: null
  })

  const [images, setImages] = useState([])

  const [travelGuide, setTravelGuide] = useState('')

  const [date, setDate] = useState({
    starting: '',
    ending: '',
    currBooking: 0,
    limitBooking: 1
  })

  const [scheduledItem, setScheduledItem] = useState({
    location: '',
    day: 1,
    description: ''
  })

  useEffect(() => { 
    if(location.state && location.state.fromConcept && currAdventureCanvases) {
      setAdventureCanvas({
        tripName: currAdventureCanvases.tripName,
        duration: currAdventureCanvases.duration,
        description: currAdventureCanvases.description
      })
    }
  // eslint-disable-next-line
  },  [])

  const handleAdventureCanvasInput = (e) => {
    const { name, value } = e.target
    setAdventureCanvas({ ...adventureCanvas, [name]: value })
  }

  const handleImagesInput = (e) => {
    const files = Array.from(e.target.files)
    setImages([...files])
  }

  const handleDateInput = (e) => {
    const { name, value } = e.target
    setDate({ ...date, [name]: value })
  }

  const handleScheduledItemInput = (e) => {
    const { name, value } = e.target
    setScheduledItem({ ...scheduledItem, [name]: value })
  }

  const addScheduledItem = () => {
    setError(null)

    if (scheduledItem.location.trim() === '' || scheduledItem.description.trim() === '') {
      setError('Please fill in all the required fields')
      setSuccessMsg(null)
      setShowErrorMsg(true)
      return
    }

    dispatch({type: 'ADD_SCHEDULED', payload: scheduledItem})
    setScheduledItem({
      location: '',
      day: 1,
      description: ''
    })
  }

  const addDate = () => {
    setError(null)

    if (date.starting.trim() === '' || date.ending.trim() === '') {
      setError('Please fill in all the required fields')
      setSuccessMsg(null)
      setShowErrorMsg(true)
      return
    }

    dispatch({type: 'ADD_DATE', payload: date})
    setDate({
      starting: '',
      ending: '',
      currBooking: 0,
      limitBooking: 1
    })
  }

  const createATrip = async () => {
    const tripPlan = { dates, scheduled, travelGuide }
  
    if (
      dates.length === 0 ||
      scheduled.length === 0 ||
      images.length === 0 ||
      adventureCanvas.tripName.trim() === '' ||
      adventureCanvas.description.trim() === '' ||
      adventureCanvas.cost === null ||
      adventureCanvas.duration === null
    ) {
      setError('Please fill in all the required fields')
      setSuccessMsg(null)
      setShowErrorMsg(true)
      return
    }
  
    // Prepare FormData for file uploads
    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images`, image) // Append each image file
    })
  
    // Append other fields to FormData
    formData.append('adventureCanvas', JSON.stringify(adventureCanvas))
    formData.append('tripPlan', JSON.stringify(tripPlan))

    setIsLoading(true)

    const response = await fetch('api/adventureCanvas/newTrip', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    const json = await response.json()

    if (response.ok) {
      setIsLoading(false)
      setError(null)
      setSuccessMsg(json.msg)

      // Reset all the input fields
      dispatch({ type: 'RESET_ALL', payload: scheduledItem })
      setAdventureCanvas({
        images: [],
        tripName: '',
        duration: null,
        description: '',
        cost: null,
      })
      setImages([])
      setTravelGuide('')
      setShowErrorMsg(true)
    } 
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
      setSuccessMsg(null)
      setShowErrorMsg(true)
    }
  }
  
  return (
      <section className='createATrip'>
        {isLoading && (
          <div className="loading-overlay">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Creating trip...</p>
          </div>
        )}

        <Accordion defaultActiveKey={['0']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Adventure Canvas</Accordion.Header>
            <Accordion.Body className='adventureCanvas-createATrip'>
              <label>Upload images</label>
              <input type='file' name='image'
                      onChange={handleImagesInput} id='imageUpload' accept="image/*" multiple></input>
              <input type='text' name='tripName' value={adventureCanvas.tripName} 
                      onChange={handleAdventureCanvasInput} placeholder='Trip name*'></input>
              <textarea name='description' value={adventureCanvas.description} 
                      onChange={handleAdventureCanvasInput} placeholder='Write the Adventure Canvas here...*'></textarea>
              <input type='number' name='duration' value={adventureCanvas.duration === null ? '' : adventureCanvas.duration} 
                      onChange={handleAdventureCanvasInput} min='1' placeholder='Duration*'></input>
              <input type='number' name='cost' value={adventureCanvas.cost === null ? '' : adventureCanvas.cost} 
                      onChange={handleAdventureCanvasInput} min='1' placeholder='Total cost*'></input>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Scheduled Items</Accordion.Header>
            <Accordion.Body className='scheduledItem-createATrip'>
              <Row>
                <Col className='p-0'>
                  <input type='text' name='location' value={scheduledItem.location} 
                          onChange={handleScheduledItemInput} placeholder='Site name / Location*'></input>
                  <label className='inline'>Day/s (of the trip):*</label>
                  <input className='input-days inline' type='number' name='day' value={scheduledItem.day} 
                          onChange={handleScheduledItemInput} min='1' placeholder='1'></input>
                  <textarea type='text' name='description' value={scheduledItem.description} 
                          onChange={handleScheduledItemInput} placeholder="Day's description*"></textarea>
                  <button className='createATrip-Add-btn' onClick={addScheduledItem}>Add</button>
                </Col>

                <Col className='p-0'>
                  <div xs={1} md={2} lg={3} className="card-scheduledItem-div scroll-custom">
                    {scheduled.map((scheduledItem, idx) => (
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
                  <input type='date' name='starting' value={date.starting} onChange={handleDateInput}></input>
                  <label>Ending:*</label>
                  <input type='date' name='ending' value={date.ending} onChange={handleDateInput}></input>
                  <label>Group size:*</label>
                  <input type='number' name='limitBooking' value={date.limitBooking} 
                          onChange={handleDateInput} placeholder='0' min='1'></input>
                  <button className='createATrip-Add-btn' onClick={addDate}>Add</button>
                </Col>

                <Col className='p-0'>
                  <div xs={1} md={2} lg={3} className="card-scheduledItem-div scroll-custom">
                    {dates.map((tripDate, idx) => (
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
              <textarea value={travelGuide}
                        onChange={(e) => setTravelGuide(e.target.value)} 
                        placeholder='Notes for travelers...'>
              </textarea>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
                
        <button className='createATrip-PublishTrip-btn' onClick={createATrip}>Create Trip</button>

        <Modal show={showErrorMsg} onHide={handleCloseErrorMsg} animation={false} centered>
            <Modal.Body className={'createATrip-Modal' && error ? 'errorMsg' : 'successMsg'}>
                { error && <ErrorMsg msg={error}/> }
                { success &&  <SuccessMsg msg={success}/> }
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <button onClick={handleCloseErrorMsg}>Close</button>
            </Modal.Footer>
        </Modal>
      </section>
  )
}

export default CreateTrip