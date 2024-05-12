import { useState } from "react"
import { Modal, Button } from "react-bootstrap"

const user = {
    username: 'Username',
    email: 'email@exmple.com',
    title: 'some title'
}

const Profile = () => {

    const [emailEditable, setEmailEditable] = useState(false)
    const [passwordEditable, setPasswordEditable] = useState(false)
    const [titleEditable, setTitleEditable] = useState(false)

    const [profileImage, setProfileImage] = useState('./images/user-blank-profile.png')

    const [showDelete, setShowDelete] = useState(false)
    const handleCloseDelete = () => setShowDelete(false)
    const handleShowDelete = () => setShowDelete(true)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            setProfileImage(reader.result)
        }

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    return (
        <section className='profile-container'>
            <div className='profile-all-divs'>
                <div className='profile-img-and-username'>
                    <div className='profile-img-btns-div'>
                        <button>
                            <label htmlFor='profile-upload-img' className='upload-btn'>
                                <i className='fa fa-pencil'></i> Edit Image
                            </label>
                            <input type='file' accept='image/*' id='profile-upload-img' onChange={handleImageChange} style={{ display: 'none' }} />
                        </button>
                        <button onClick={() => setProfileImage('./images/user-blank-profile.png')}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </div>
                    <img src={profileImage} alt=''/>
                    <label><b>{user.username}</b></label>
                </div>

                <div className='profile-fields'>
                    <label>Email:</label>
                    <div>
                        <input disabled={!emailEditable} placeholder={user.email}></input>
                        {!emailEditable && <button onClick={() => setEmailEditable(true)}><i className='fa fa-pencil'></i></button>}
                        {emailEditable && <button onClick={() => setEmailEditable(false)}><i className='fa fa-check'></i></button>}
                        {emailEditable && <button onClick={() => setEmailEditable(false)}><i className='fa fa-close'></i></button>}
                    </div>
                    <label>Password:</label>
                    <div>
                        <input disabled={!passwordEditable}></input>
                        {!passwordEditable && <button onClick={() => setPasswordEditable(true)}><i className='fa fa-pencil'></i></button>}
                        {passwordEditable && <button onClick={() => setPasswordEditable(false)}><i className='fa fa-check'></i></button>}
                        {passwordEditable && <button onClick={() => setPasswordEditable(false)}><i className='fa fa-close'></i></button>}
                    </div>
                    <label>Title:</label>
                    <div>
                        <input disabled={!titleEditable} placeholder={user.title}></input>
                        {!titleEditable && <button onClick={() => setTitleEditable(true)}><i className='fa fa-pencil'></i></button>}
                        {titleEditable && <button onClick={() => setTitleEditable(false)}><i className='fa fa-check'></i></button>}
                        {titleEditable && <button onClick={() => setTitleEditable(false)}><i className='fa fa-close'></i></button>}
                    </div>

                    <button onClick={handleShowDelete} className='profile-delete-btn'>Delete Account</button>
                </div>
            </div>
            
            {/* pop-up modal for the delete account */}
            <Modal show={showDelete} onHide={handleCloseDelete} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Your Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete your account? <br/>
                    All Your data will be deleted, this action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleCloseDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}


export default Profile