import { Modal, Spinner } from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

// components
import ForumChat from './ForumChat'
import ErrorMsg from '../components/ErrorMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'

const Forum = (props) => {
    const { user } = useAuthContext()
    const socket = useRef()
    const chatContainerRef = useRef(null)

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [message, setMessage] = useState('')
    const [forum, setForum] = useState(null)
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [comments])

    useEffect(() => {
        if (!props.show) return
    
        if (user) {
            socket.current = io("http://localhost:4000")
            socket.current.emit('add-user', { email: user.email, forumId: props.adventureCanvase_id })
    
            // Listen for incoming messages
            socket.current.on('msg-recieve', (comment) => {
                setComments((prevComments) => [...prevComments, comment])
            })
    
            // Listen for updated comments
            socket.current.on('comment-updated', (updatedComment) => {
                setComments((prevComments) => 
                    prevComments.map((comment) => 
                        comment._id === updatedComment._id ? updatedComment : comment
                    )
                )
            })
        }
    
        return () => {
            if (socket.current) {
                socket.current.disconnect()
            }
        }
    }, [user, props.show, props.adventureCanvase_id])

    useEffect(() => { 
        if (!props.show) return

        setIsLoading(true)

        const fetchForumContent = async () => {
            const response = await fetch(`/api/forum/getForumContent/${props.adventureCanvase_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setError(null)
                setIsLoading(false)
                setForum(json)
                setComments(json.comments)
            }

            if (!response.ok) {
                setError(json.error)
            }
        }

        user && props.adventureCanvase_id && fetchForumContent()
    },  [user, props.adventureCanvase_id, props.show])

    const sendMsg = async () => {
        setError(null)
        
        if(message.trim() === '') {
            setError('You must enter message before sending.')
            return
        }
        
        const response = await fetch(`/api/forum/addMsg/${forum._id}`, {
            method: 'PATCH',
            body: JSON.stringify({ userType: user.userType, username: user.username, email: user.email, photo: user.photo, message }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
    
        const json = await response.json()
    
        if (response.ok) {
            setError(null)
            // Emit the message to server with forum ID
            socket.current.emit('send-msg', { forumId: forum.adventureCanvas_id, comment: json })
            setMessage('')
        }
    
        if (!response.ok) {
            setError(json.error)
        }
    }
    
    const handleLikeDislike = async (commentId, action) => {
        const response = await fetch(`/api/forum/updateLikeDislike/${forum._id}/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ email: user.email, action }),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
    
        const json = await response.json()
    
        if (response.ok) {
            setError(null)
            // Update the specific comment in the comments state
            socket.current.emit('comment-updated', { forumId: forum.adventureCanvas_id, comment: json })
        } else {
            setError(json.error)
        }
    }

    return(
        <Modal {...props} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.forumtitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { isLoading && 
                    <div className='no-result-label'>
                        <Spinner animation="border" role="status"></Spinner>
                        <span>Loading...</span>
                    </div>
                }
                { !isLoading && comments.length > 0 &&
                    <div ref={chatContainerRef} xs={1} md={2} lg={3} className='scroll-custom-forum'>
                        {comments.map((userChat, idx) => (
                            <div key={idx}>
                                <ForumChat userChat={userChat} handleLikeDislike={handleLikeDislike}/>
                            </div>
                        ))}
                    </div>
                }
                { !isLoading && comments.length === 0 &&
                    <label className='no-result-label'>
                        Start a conversation with the traveler's community <br/>by sending message, questions, tips or advice in this forum.
                    </label>
                }
            </Modal.Body>
            <Modal.Footer className='forum-modal-footer'>
                    <input className='forum-input' placeholder='Write your message here...'
                            value={message} onChange={(e) => setMessage(e.target.value)} ></input>
                    <button className='forum-send-msg-btn' onClick={sendMsg}><i className="fa fa-paper-plane"></i></button>
                    { error && <ErrorMsg msg={error}/> }
            </Modal.Footer>
        </Modal>
    )
}

export default Forum