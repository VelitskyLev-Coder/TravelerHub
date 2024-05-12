import { Modal } from 'react-bootstrap';

import ForumChat from './ForumChat';

const forumChats = [
    {image: './images/user-blank-profile.png', username: 'Sarah', tourGuide: null, info: "Hi everyone! I'm Sarah, and I'm really excited about the upcoming organized trip to Charleston. The itinerary looks fantastic!", createdAt: '23/04/2024', like: 1, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'Mark', tourGuide: null, info: "Hey Sarah, I'm Mark. I actually went on a similar organized trip to Charleston last year, and it was a fantastic experience. You're going to love it!", createdAt: '23/04/2024', like: 11, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'Lisa', tourGuide: null, info: "Hi Sarah and Mark, I'm Lisa. I just booked my spot on the trip, and I can't wait to explore Charleston with everyone.", createdAt: '25/04/2024', like: 2, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'David', tourGuide: null, info: "Hi everyone, I'm David. I'm from Charleston, so I'm really looking forward to showing you all around my hometown.", createdAt: '25/04/2024', like: 5, dislike: 0},
    // {image: './images/user-blank-profile.png', username: 'Mark', tourGuide: null, info: "Good advice, David! I remember the walking tours were a highlight of my trip. The guides were so knowledgeable and really brought Charleston's history to life.", createdAt: '28/04/2024', like: 9, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'Lisa', tourGuide: null, info: "I'm really looking forward to the food! Do you have any restaurant recommendations, David?", createdAt: '28/04/2024', like: 1, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'David', tourGuide: null, info: "Absolutely! Husk is a must-visit for its innovative Southern cuisine. Another great spot is The Ordinary, known for its seafood dishes.", createdAt: '29/04/2024', like: 10, dislike: 1},
    {image: './images/user-blank-profile.png', username: 'Sarah', tourGuide: null, info: "Those sound amazing! I can't wait to try them. Are there any specific attractions or sights we shouldn't miss?", createdAt: '30/04/2024', like: 0, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'David', tourGuide: null, info: "Definitely visit The Battery and White Point Garden for some great views of the harbor. Rainbow Row and Waterfront Park are also must-see spots for their beauty and history.", createdAt: '30/04/2024', like: 0, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'Sarah', tourGuide: null, info: "That's great, David! Do you have any insider tips or recommendations for our trip?", createdAt: '26/04/2024', like: 4, dislike: 0},
    {image: './images/user-blank-profile.png', username: 'David', tourGuide: null, info: "Definitely! One tip I have is to bring comfortable shoes, as we'll be doing a lot of walking. Also, be sure to try some of the local cuisine, like shrimp and grits or she-crab soup.", createdAt: '28/04/2024', like: 8, dislike: 1},
    {image: './images/user-blank-profile.png', username: 'Daniel', tourGuide: '1', info: "Hello everyone, I'm your tour guide for the trip. I'm so excited to show you all the best of Charleston and ensure you have a memorable experience.", createdAt: '30/04/2024', like: 14, dislike: 0}
]

const Forum = (props) => {
    return(
        <Modal {...props} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.forumtitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div xs={1} md={2} lg={3} className='scroll-custom-forum'>
                    {forumChats.map((userChat, idx) => (
                        <div key={idx}>
                            <ForumChat userChat={userChat} />
                        </div>
                    ))}
                </div>

            </Modal.Body>
            <Modal.Footer className='forum-modal-footer'>
                    <input className='forum-input' placeholder='Write your message here...'></input>
                    <button className='forum-send-msg-btn'><i className="fa fa-paper-plane"></i></button>
                {/* <Button onClick={props.onHide}>Close</Button> */}
            </Modal.Footer>
        </Modal>
    )
}

export default Forum