import './SignIn.css'
import '../Authentication.scss'
import { useForm } from 'react-hook-form'
import httpClient from '../../../services/api-services/http-client'
import { apiUrls } from '../../../services/api-services/api-urls';
import { useHistory } from 'react-router-dom';
import Home_Route from '../../../routes/Home/Home';

export default function SignIn() {
    /* COMPONENT HOOKS */
    const { register, handleSubmit, reset, errors } = useForm();
    const history = useHistory();

    /* FORM STATIC DATA */
    let textFieldOptions = {
        email: { placeholder: 'Enter Email', name: 'email', validations: { maxLength: 100, required: 'Email Address is required', pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ } },
        password: { placeholder: 'Enter Password ', name: 'password', validations: { required: 'Password is required' } }
    };

    const onSuccessfulSignIn = (result: any) => {
        if(!result || !result.token || Object.keys(result).length < 1)
        return;
        
        //Reset the form
        reset();

        //Set token
        localStorage.setItem("token", result.token);

        //Navigate to main home screen
        history.replace(Home_Route.routeHome);
    }

    const signIn = (data: Object) => {
        /* INTEGRATE SIGN IN API */
        httpClient.post(apiUrls['sign-in'].route, data)
        .then((result: any) => {
            if(result && result.success) {
                onSuccessfulSignIn(result);
            }
        });
    }

    return (
        <div className="sign__in__container">
            <form onSubmit={handleSubmit(signIn)}>
                <div className="text-field-container email__field">
                    <input name={textFieldOptions.email.name} className={`text-field ${errors[textFieldOptions.email.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.email.validations)} placeholder={textFieldOptions.email.placeholder} />
                    {errors[textFieldOptions.email.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> {errors[textFieldOptions.email.name].message}</span> <span> {(errors[textFieldOptions.email.name] && !errors[textFieldOptions.email.name].message && errors[textFieldOptions.email.name].type !== "maxLength") ? 'Email is invalid' : ''} </span>
                        {errors[textFieldOptions.email.name] && errors[textFieldOptions.email.name].type === "maxLength" && (
                            <span role="alert">Max length exceeded</span>
                        )}
                    </div>}
                </div>

            <div className="text-field-container password__field">
                <input name={textFieldOptions.password.name} className={`text-field ${ errors[textFieldOptions.password.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.password.validations)} placeholder={textFieldOptions.password.placeholder} type="password" />
                { errors[textFieldOptions.password.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> { errors[textFieldOptions.password.name].message }</span> </div> }
            </div>
            
            <div className="sign__in__options d-flex justify-content-center">
                <button type="submit" className="primary-btn auth-btn"> Sign In </button>
            </div>
            </form>
        </div>
    )
}
