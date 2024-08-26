import { Card, CardFooter } from 'react-bootstrap'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const Review = ({ review }) => {

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                stars.push(<span key={i} className="star filled">★</span>)
            } else {
                stars.push(<span key={i} className="star unfilled">☆</span>)
            }
        }
        return stars
    }

    return(
        <Card className='review-card'>
            <Card.Body>
                <Card.Title>
                    <img className='review-photo' src={review.travelerPhoto} alt=''/>  {review.travelerName}
                </Card.Title>
                <div className="review-rating">
                    {renderStars()}
                </div>
                <Card.Text className='scroll-custom-adventureCanvase'>{review.content}</Card.Text>
            </Card.Body>
            <CardFooter>{formatDistanceToNow(new Date(review.createdAt),{ addSuffix: true })}</CardFooter>
        </Card>
    )
}

export default Review