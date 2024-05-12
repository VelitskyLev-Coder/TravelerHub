import { Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const UserConcept = ({ userConcept }) => {

    return(
        <section className='userConcept-section'>
            <Card className='adventureCanvase-card concept-card'>
                <Card.Body>
                    <Card.Title>{userConcept.tripName} | {userConcept.durantion}</Card.Title>
                    <Card.Text className='userConcept-info-scroll-custom'>{userConcept.info}</Card.Text>
                </Card.Body>
                <Card.Footer className='userConcept-card-footer'>
                    <button><FontAwesomeIcon icon={faThumbsUp} /> <Badge bg="secondary">{userConcept.like}</Badge></button>
                    <label>interested travelers</label><br/>
                </Card.Footer>
            </Card>
        </section>
    )
}

export default UserConcept