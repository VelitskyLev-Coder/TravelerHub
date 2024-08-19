import { Card, Col, Row } from 'react-bootstrap'

import { useTripPlanContext } from '../hooks/useTripPlanContext'

const ScheduledItem = ({ scheduledItem }) => {

    const {dispatch} = useTripPlanContext()

    const deleteScheduledItem = () => {
        dispatch({type: 'DELETE_SCHEDULED', payload: scheduledItem})
    }

    return(
        <section className='background'>
            <Card className='scheduledItem-card'>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col>
                                Day {scheduledItem.day}:{' ' + scheduledItem.location} 
                            </Col>
                            <Col className='delete-scheduledItem-col' xs="auto">
                                <button 
                                    className='delete-scheduledItem' 
                                    onClick={deleteScheduledItem}>
                                        <i className="fa fa-trash"></i>
                                </button>
                            </Col>
                        </Row>
                    </Card.Title>
                    <Card.Text>{scheduledItem.description}</Card.Text>
                </Card.Body>
            </Card>
        </section>
    )
}

export default ScheduledItem