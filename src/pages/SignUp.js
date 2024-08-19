import React from 'react';
import { Form, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useState } from 'react';
import { useSignup } from '../hooks/useSignup'
import ErrorMsg from "../components/ErrorMsg";

const SignUp = () => {

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [photo, setPhoto] = useState(null)

    const {signup, isLoading, error} = useSignup()

    const handleSignupBtn = async (e) => {
        e.preventDefault();
        await signup(email, username, password, photo, 'traveler')
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Entering as a guest will allow you to ONLY view trips. You will not be able to book, discuss in the forum, create concepts, or access other features.
        </Tooltip>
    )

    return (
        <section className='background-login-signup'>
            <div className='login-container sign-up-container'>
                <h2>Sign Up</h2>
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

                <p>Already have an account? <a href='/login'>Log In</a></p>

                <p>
                    Don't want to create an account? <a href='/homeuser'>Stay as a guest </a>
                    <OverlayTrigger overlay={renderTooltip}>
                        <i className="fa fa-exclamation-circle"></i>
                    </OverlayTrigger>
                </p>
            </div>
        </section>
    )
}

export default SignUp