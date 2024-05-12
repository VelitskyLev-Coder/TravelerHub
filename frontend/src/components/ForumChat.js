import React from 'react';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ForumChat = ({ userChat }) => {
    return(
        <div className='container-ForumChat'>
            <div className='ForumChat-title'>
                <img src={userChat.image} alt=''/>
                <label className='username-label'>{userChat.username}</label>
                { userChat.tourGuide && 
                    <Badge pill bg="primary" className='badge-TourGuide'>Tour Guide</Badge>
                }
                <label>{userChat.createdAt}</label>
            </div>
            <div className='ForumChat-contant'>
                <p>{userChat.info}</p>
            </div>
            <div className='ForumChat-btns'>
                <button><FontAwesomeIcon icon={faThumbsUp} /> <Badge bg="secondary">{userChat.like}</Badge></button>
                <button><FontAwesomeIcon icon={faThumbsDown} /> <Badge bg="secondary">{userChat.dislike}</Badge></button>
            </div>
        </div>
    )
}

export default ForumChat