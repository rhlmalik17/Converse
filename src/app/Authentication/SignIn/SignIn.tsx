import './SignIn.css'
import '../Authentication.scss'
import { useForm } from 'react-hook-form'
import httpClient from '../../../services/api-services/http-client'
import { apiUrls } from '../../../services/api-services/api-urls';
import ToastService from '../../../services/app-services/toast-service';

export default function SignIn() {
    /* COMPONENT HOOKS */
    const { register, handleSubmit, reset, errors } = useForm();


    /* FORM STATIC DATA */
    let textFieldOptions = {
        email: { placeholder: 'Enter Email', name: 'email', validations: { required: 'Email Address is required', pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ } },
        password: { placeholder: 'Enter Password ', name: 'password', validations: { required: 'Password is required' } }
    };

    const onSuccessfulSignIn = (result: any) => {
        if(!result || !result.token || Object.keys(result).length < 1)
        return;

        //show toast
        ToastService.showToast("success", result.message);

        //Reset the form
        reset();

        //Set token
        localStorage.setItem("token", result.token);

        //TODO: Navigate to main home screen
    }

    const signIn = (data: Object) => {
        /* INTEGRATE SIGN IN API */
        httpClient.post(apiUrls['sign-in'], data)
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
                <input name={textFieldOptions.email.name} className={`text-field ${ errors[textFieldOptions.email.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.email.validations)} placeholder={textFieldOptions.email.placeholder} type="email" />
                { errors[textFieldOptions.email.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> { errors[textFieldOptions.email.name].message }</span> <span> { (errors[textFieldOptions.email.name] && !errors[textFieldOptions.email.name].message) ? 'Email is invalid' : '' } </span> </div> }
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
