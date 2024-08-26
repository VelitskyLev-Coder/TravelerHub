import { Card, Button, Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'

// components
import Forum from './Forum'

// hooks
import { useCurrAdventureCanvaseContext } from '../hooks/useCurrAdventureCanvaseContext'

const AdventureCanvase = ({ adventureCanvase }) => {

    const [forumShow, setForumShow] = useState(false)
    const {dispatch} = useCurrAdventureCanvaseContext()

    const setAdventureCanvase = () => {
        localStorage.setItem('currAdventureCanvases', JSON.stringify(adventureCanvase)) // Save to local storage
        dispatch({type: 'SET_CURRENT_ADVENTURE_CANVASES', payload: adventureCanvase})
    }

    return(
        <section className='adventureCanvase-section'>
            <Card className='adventureCanvase-card'>
                {adventureCanvase.images && (
                    <Carousel>
                        {adventureCanvase.images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img className="d-block w-100 adventureCanvase-carousel-img" src={image} alt={`Slide ${index}`}/>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
                <Card.Body>
                    <Card.Title>{adventureCanvase.tripName} | {adventureCanvase.duration} Day/s</Card.Title>
                    <Card.Text className='scroll-custom-adventureCanvase'>{adventureCanvase.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Card.Text>Cost: {adventureCanvase.cost}$</Card.Text>
                </Card.Footer>
                <Card.Footer className="d-flex justify-content-between">
                    <Button variant="primary" onClick={() => setForumShow(true)}>Open Form</Button>
                    <Link className='adventureCanvase-link' onClick={setAdventureCanvase} to="/tripPlan">Read More</Link>
                </Card.Footer>
            </Card>

            <Forum forumtitle={adventureCanvase.tripName} adventureCanvase_id={adventureCanvase._id} 
                    show={forumShow} onHide={() => setForumShow(false)}/>
        </section>
    )
}

export default AdventureCanvase