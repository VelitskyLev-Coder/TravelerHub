import { Card, Col, Row } from 'react-bootstrap'

const TripDates = ({ tripDate }) => {
    return(
        <section className='background'>
            <Card className='scheduledItem-card'>
                <Card.Body>
                    <Row>
                        <Col>
                            {tripDate.starting} - {tripDate.ending} (group size: {tripDate.limitBooking})
                        </Col>
                        <Col className='delete-scheduledItem-col' xs="auto">
                            <button className='delete-scheduledItem'><i className="fa fa-trash"></i></button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </section>
    )
}

export default TripDates