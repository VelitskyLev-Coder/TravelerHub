import React from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'
import { useState } from 'react'

// hooks
import { useSignup } from '../hooks/useSignup'

// components
import ErrorMsg from "../components/ErrorMsg"

const SignUp = () => {

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const {signup, isLoading, error} = useSignup()

    const handleSignupBtn = async (e) => {
        e.preventDefault()
        await signup(email, username, password, 'traveler')
    }

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

                    <button disabled={isLoading} className='login-btn-home' onClick={handleSignupBtn}>Sign Up</button>
                </form>

                { error &&  <ErrorMsg msg={error}/> }

                <p>Already have an account? <a href='/login'>Log In</a></p>
            </div>
        </section>
    )
}

export default SignUp