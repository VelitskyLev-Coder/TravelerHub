import { useState } from "react"
import { Modal, Button, Spinner } from "react-bootstrap"

// components
import ErrorMsg from '../components/ErrorMsg'
import SuccessMsg from '../components/SuccessMsg'

// hooks
import { useAuthContext } from '../hooks/useAuthContext'

const Profile = () => {

    const { user, dispatch } = useAuthContext()

    const [isUsernameEditable, setIsUsernameEditable] = useState(false)
    const [isPasswordEditable, setIsPasswordEditable] = useState(false)

    const [editableUsername, setEditableUsername] = useState('')
    const [editablePassword, setEditablePassword] = useState('')

    const [error, setError] = useState(null)
    const [success, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [showDelete, setShowDelete] = useState(false)
    const handleCloseDelete = () => setShowDelete(false)
    const handleShowDelete = () => setShowDelete(true)

    const handleIsUsernameEditable = () => {
        setIsUsernameEditable(false)
        setError(null)
        setSuccessMsg(null)
    }

    const handleIsPasswordEditable = () => {
        setIsPasswordEditable(false)
        setError(null)
        setSuccessMsg(null)
    }

    const handleImageUpdate = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            setError('No file selected.')
            return
        }
    
        setSuccessMsg(null)
        setError(null)
        setIsLoading(true)
    
        const formData = new FormData()
        formData.append('image', file)
        console.log('formData=', formData)
        try {
            const response = await fetch('/api/profile/uploadPhoto', {
                method: 'PATCH',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    // 'Content-Type': 'application/json'
                }
            })
    
            const json = await response.json()
            if (response.ok) {
                setSuccessMsg('Image uploaded successfully!')
                setError(null)
                dispatch({type: 'UPDATE_PHOTO', payload: json.photo})
            } else {
                setError(json.data.error || 'An unknown error occurred.')
                setSuccessMsg(null)
            }
        } catch (error) {
            setError('An error occurred while uploading the image. Try again or try uploading a different image.')
            console.error('Upload error:', error)
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleImageDelete = async () => {

        const response = await fetch('/api/profile/deletePhoto', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'UPDATE_PHOTO', payload: json.photo})
            setSuccessMsg(json.msg)
            setError(null)
        }

        if (!response.ok) {
            setError(json.error)
            setSuccessMsg(null)
        }
    }

    const updateUsername = async () => {

        if (editableUsername.trim().length === 0) {
            setError('Username must contains characters')
            return
        }

        const response = await fetch('api/profile/username', {
            method: 'PATCH',
            body: JSON.stringify({ username: editableUsername}),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setSuccessMsg(null)
        }

        if (response.ok) {
            setError(null)
            setSuccessMsg(json.msg)
            setIsUsernameEditable(false)
            dispatch({type: 'UPDATE_USERNAME', payload: editableUsername})
        }
    }

    const updatePassword = async () => {

        if (editablePassword.trim().length === 0) {
            setError('Password must contains characters')
            return
        }

        const response = await fetch('api/profile/password', {
            method: 'PATCH',
            body: JSON.stringify({ password: editablePassword}),
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setSuccessMsg(null)
        }

        if (response.ok) {
            setError(null)
            setSuccessMsg(json.msg)
            setIsPasswordEditable(false)
        }
    }

    if (!user) {
        return null // Render nothing if user is null
    }

    return (
        <section className='profile-container'>
            <div className='profile-background'></div>

            <div className='profile-img-email'>
                <div className='profile-img-btn'>
                    <button>
                        <label htmlFor='profile-upload-img' className='upload-btn'>
                            <i className='fa fa-pencil'></i>
                        </label>
                        <input type='file' accept='image/*' id='profile-upload-img' onChange={handleImageUpdate} style={{ display: 'none' }} />
                    </button>
                    <button onClick={handleImageDelete}>
                        <i className='fa fa-trash'></i>
                    </button>
                </div>
                { isLoading && <Spinner animation="border" role="status"></Spinner> }
                { !isLoading && <img className='profile-img' src={user.photo} alt=''/> }
                <label><b>{user.email}</b></label>
            </div>

            <div className='profile-info'>
                <label>Username:</label>
                <div>
                    <input 
                        disabled={!isUsernameEditable} 
                        placeholder={user.username}
                        value={editableUsername}
                        onChange={(e) => setEditableUsername(e.target.value)}>
                    </input>
                    {!isUsernameEditable && <button onClick={() => setIsUsernameEditable(true)}><i className='fa fa-pencil'></i></button>}
                    {isUsernameEditable && <button onClick={updateUsername}><i className='fa fa-check'></i></button>}
                    {isUsernameEditable && <button onClick={handleIsUsernameEditable}><i className='fa fa-close'></i></button>}
                </div>
                <label>Password:</label>
                <div>
                    <input 
                        disabled={!isPasswordEditable}
                        type='password'
                        value={editablePassword}
                        onChange={(e) => setEditablePassword(e.target.value)}>
                    </input>
                    {!isPasswordEditable && <button onClick={() => setIsPasswordEditable(true)}><i className='fa fa-pencil'></i></button>}
                    {isPasswordEditable && <button onClick={updatePassword}><i className='fa fa-check'></i></button>}
                    {isPasswordEditable && <button onClick={handleIsPasswordEditable}><i className='fa fa-close'></i></button>}
                </div>

                { error &&  <ErrorMsg msg={error}/> }
                { success &&  <SuccessMsg msg={success}/> }
                
                <button onClick={handleShowDelete} className='profile-delete-btn'>Delete Account</button>
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