import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate()
    
    const handleLoginBtn = async (e) => {
        e.preventDefault();
        navigate(`/homeuser`)
    }

    return (
        <section className='background-login-signup'>
            <div className='login-container'>
                <h2>Login</h2>
                <form>
                    <FloatingLabel label="Email address*" className="mb-3">
                        <Form.Control type="email" placeholder="name@example.com" />
                    </FloatingLabel>

                    <FloatingLabel label="Password*">
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>

                    <button className='login-btn-home' onClick={handleLoginBtn}>Login</button>
                </form>
                <p>Don't have an account? <a href='/signup'>Sign up</a></p>
            </div>
        </section>
    )
}

export default Login