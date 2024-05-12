import { Card, Col, Row } from 'react-bootstrap'

const ScheduledItem = ({ scheduledItem }) => {
    return(
        <section className='background'>
            <Card className='scheduledItem-card'>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col>
                                Day {scheduledItem.day}:{' ' + scheduledItem.siteName} 
                            </Col>
                            <Col className='delete-scheduledItem-col' xs="auto">
                                <button className='delete-scheduledItem'><i className="fa fa-trash"></i></button>
                            </Col>
                        </Row>
                    </Card.Title>
                    <Card.Text>{scheduledItem.decription}</Card.Text>
                </Card.Body>
            </Card>
        </section>
    )
}

export default ScheduledItem