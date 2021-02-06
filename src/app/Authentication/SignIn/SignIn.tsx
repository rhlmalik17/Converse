import './SignIn.css'
import '../Authentication.scss'

export default function SignIn() {
    return (
        <div className="sign__in__container">
            <div className="text-field-container email__field">
                <input placeholder="Enter Email" type="email" />
            </div>

            <div className="text-field-container password__field">
                <input placeholder="Enter Password" type="password" />
            </div>
            
            <div className="sign__in__options d-flex justify-content-center">
                <button className="primary-btn auth-btn"> Sign In </button>
            </div>
        </div>
    )
}
