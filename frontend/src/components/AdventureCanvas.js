import { Card, Button, Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react';

import Forum from './Forum';

const AdventureCanvase = ({ adventureCanvase }) => {

    const [forumShow, setForumShow] = useState(false);

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
                    <Card.Title>{adventureCanvase.tripName} | {adventureCanvase.durantion}</Card.Title>
                    <Card.Text className='scroll-custom-adventureCanvase'>{adventureCanvase.info}</Card.Text>
                    {/* <Card.Text>Cost: {adventureCanvase.cost}</Card.Text> */}
                </Card.Body>
                <Card.Footer>
                    <Card.Text>Cost: {adventureCanvase.cost}</Card.Text>
                </Card.Footer>
                <Card.Footer className="d-flex justify-content-between">
                        <Button variant="primary" onClick={() => setForumShow(true)}>Open Form</Button>
                        <Link className='adventureCanvase-link' to="/tripPlan">Read More</Link>
                </Card.Footer>
            </Card>

            <Forum forumtitle={adventureCanvase.tripName} show={forumShow} onHide={() => setForumShow(false)}/>
        </section>
    )
}

export default AdventureCanvase