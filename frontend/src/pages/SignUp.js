import React from 'react';
import { Form, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';

const SignUp = () => {

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
                        <Form.Control type="email" placeholder="name@example.com" />
                    </FloatingLabel>

                    <FloatingLabel label="Username*">
                        <Form.Control type="username" placeholder="Username" />
                    </FloatingLabel>

                    <FloatingLabel label="Password*">
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>

                    <FloatingLabel label="Title (optional)">
                        <Form.Control type="text" placeholder="title" />
                    </FloatingLabel>

                    <Form.Group controlId="formFile" className="mt-2">
                        <Form.Label>Upload Photo (optional)</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>

                    <button className='login-btn-home' type='submit'>Sign Up</button>
                </form>

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

export default SignUp;