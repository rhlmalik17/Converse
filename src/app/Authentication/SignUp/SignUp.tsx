import React from 'react'
import './SignUp.css'

function SignUp() {
    return (
        <div className="sign__up__container">
            <div className="text-field-container name__field">
                <input placeholder="First Name" type="text" />
            </div>

            <div className="text-field-container name__field">
                <input placeholder="Last Name" type="text" />
            </div>

            <div className="text-field-container email__field">
                <input placeholder="Enter Email" type="email" />
            </div>

            <div className="text-field-container password__field">
                <input placeholder="Enter Password" type="password" />
            </div>
            
            <div className="sign__up__options d-flex justify-content-center">
                <button className="primary-btn auth-btn"> Sign Up  </button>
            </div>
        </div>
    )
}

export default SignUp
