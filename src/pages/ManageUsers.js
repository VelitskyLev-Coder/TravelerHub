import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';

// components
import ErrorMsg from "../components/ErrorMsg";
import SuccessMsg from '../components/SuccessMsg'

// hooks
import { useSignup } from '../hooks/useSignup'

const ManageUsers = () => {

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [photo, setPhoto] = useState(null)

    const {signup, isLoading, error, success} = useSignup()

    const handleSignupBtn = async (e) => {
        e.preventDefault();
        await signup(email, username, password, photo, 'tourOperator')
    }

    return (
        <section className='background-login-signup'>
            <div className='login-container sign-up-container'>
                <h2>Create Tour Operator Account</h2>
                <form>
                    <FloatingLabel label="Email address*">
                        <Form.Control 
                            type="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="name@example.com" 
                        />
                    </FloatingLabel>

                    <FloatingLabel label="Username*">
                        <Form.Control 
                            type="username" 
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            placeholder="Username" 
                        />
                    </FloatingLabel>

                    <FloatingLabel label="Password*">
                        <Form.Control 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password" 
                        />
                    </FloatingLabel>

                    <Form.Group controlId="formFile" className="mt-2">
                        <Form.Label>Upload Photo (optional)</Form.Label>
                        <Form.Control 
                            type="file" 
                            onChange={(e) => setPhoto(e.target.value)}
                            value={photo}
                        />
                    </Form.Group>

                    <button disabled={isLoading} className='login-btn-home' onClick={handleSignupBtn}>Sign Up</button>
                </form>

                { error &&  <ErrorMsg msg={error}/> }
                { success &&  <SuccessMsg msg={success}/> }
            </div>
        </section>
    )
}

export default ManageUsers