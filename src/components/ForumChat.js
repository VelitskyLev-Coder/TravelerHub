import { useState, useEffect, React } from 'react'
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'

const ForumChat = ({ userChat, handleLikeDislike }) => {
    const {user} = useAuthContext()
    
    const [isLikeClicked, setIsLikeClicked] = useState(false)
    const [isDislikeClicked, setIsdislikeClicked] = useState(false)

    // Define CSS classes based on the state
    const likeIconClassName = isLikeClicked ? 'on' : 'off'
    const dislikeIconClassName = isDislikeClicked ? 'on' : 'off'

    useEffect(() => {
        if (!user) return 

        if (userChat.likes.includes(user.email)) {
            setIsLikeClicked(true)
        } else {
            setIsLikeClicked(false)
        }
        
        if (userChat.dislikes.includes(user.email)) {
            setIsdislikeClicked(true)
        } else {
            setIsdislikeClicked(false)
        }
    }, [user, userChat.dislikes, userChat.likes, user.email])

    return(
        <div className='container-ForumChat'>
            <div className='ForumChat-title'>
                <img src={userChat.photo} alt=''/>
                <label className='username-label'>{userChat.username}</label>
                { userChat.userType === 'tourOperator' && 
                    <Badge pill bg="primary" className='badge-TourGuide'>Tour Guide</Badge>
                }
                <label>{formatDistanceToNow(new Date(userChat.createdAt),{ addSuffix: true })}</label>
            </div>
            <div className='ForumChat-contant'>
                <p>{userChat.message}</p>
            </div>
            <div className='ForumChat-btns'>
                <button className={likeIconClassName} onClick={() => handleLikeDislike(userChat._id, 'like')}>
                    <FontAwesomeIcon icon={faThumbsUp} /> <Badge bg="secondary">{userChat.likes?.length || 0}</Badge>
                </button>
                <button className={dislikeIconClassName} onClick={() => handleLikeDislike(userChat._id, 'dislike')}>
                    <FontAwesomeIcon icon={faThumbsDown} /> <Badge bg="secondary">{userChat.dislikes?.length || 0}</Badge>
                </button>
            </div>
        </div>
    )
}

export default ForumChat