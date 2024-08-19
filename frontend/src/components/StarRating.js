import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null)

    return (
        <div>
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: 'none' }}
                        />
                        <FontAwesomeIcon
                            icon={faStar}
                            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                            size="2x"
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                )
            })}
        </div>
    )
}

export default StarRating