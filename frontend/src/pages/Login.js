import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';

import { useLogin } from '../hooks/useLogin'
import ErrorMsg from "../components/ErrorMsg";

const Login = () => {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {login, error, isLoading} = useLogin()

    const handleLoginBtn = async (e) => {
        e.preventDefault();
        await login(email, password)
    }
    
    return (
        <section className='background-login-signup'>
            <div className='login-container'>
                <h2>Login</h2>
                <form>
                    <FloatingLabel label="Email address*" className="mb-3">
                        <Form.Control 
                            type="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="name@example.com" 
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

                    <button disabled={isLoading} className='login-btn-home' onClick={handleLoginBtn}>Login</button>
                </form>

                { error &&  <ErrorMsg msg={error}/> }

                <p>Don't have an account? <a href='/signup'>Sign up</a></p>
            </div>
        </section>
    )
}

export default Login