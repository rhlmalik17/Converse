import './SignUp.css'
import ToastService from '../../../services/app-services/toast-service';
import { useForm } from 'react-hook-form'
import httpClient from '../../../services/api-services/http-client';
import { apiUrls } from '../../../services/api-services/api-urls';
import { useHistory } from 'react-router-dom';

function SignUp() {
    /* COMPONENT HOOKS */
    const { register, handleSubmit, reset, errors, getValues } = useForm();
    const history = useHistory();

     /* FORM STATIC DATA */
    let textFieldOptions = {
        first_name: { placeholder: 'Enter First Name ', name: 'first_name', validations: { required: 'First Name is required', min: 3 } },
        last_name: { placeholder: 'Enter Last Name ', name: 'last_name', validations: { required: 'Last Name is required', min: 3 } },
        email: { placeholder: 'Enter Email', name: 'email', validations: { required: 'Email Address is required', pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ } },
        password: { placeholder: 'Enter Password ', name: 'password', validations: { required: 'Password is required', min: 3 } }
    };

    const signUp = (data: any) => {
        /* INTEGRATE SIGN UP API */
        httpClient.post(apiUrls['sign-up'], data)
        .then((result: any) => {
            if(result && result.success) {
                //show toast
                ToastService.showToast("success", result.message);
                reset();
            }
        });
    }

    return (
        <div className="sign__up__container">
            <form onSubmit={handleSubmit(signUp)}>
                <div className="text-field-container name__field">
                    <input name={textFieldOptions.first_name.name} className={`text-field ${errors[textFieldOptions.first_name.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.first_name.validations)} placeholder={textFieldOptions.first_name.placeholder} type="text" />
                    {errors[textFieldOptions.first_name.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> {errors[textFieldOptions.first_name.name].message}</span> </div>}
                </div>

                <div className="text-field-container name__field">
                    <input name={textFieldOptions.last_name.name} className={`text-field ${errors[textFieldOptions.last_name.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.last_name.validations)} placeholder={textFieldOptions.last_name.placeholder} type="text" />
                    {errors[textFieldOptions.last_name.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> {errors[textFieldOptions.last_name.name].message}</span> </div>}
                </div>

                <div className="text-field-container email__field">
                    <input name={textFieldOptions.email.name} className={`text-field ${errors[textFieldOptions.email.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.email.validations)} placeholder={textFieldOptions.email.placeholder} type="email" />
                    {errors[textFieldOptions.email.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> {errors[textFieldOptions.email.name].message}</span> <span> {(errors[textFieldOptions.email.name] && !errors[textFieldOptions.email.name].message) ? 'Email is invalid' : ''} </span> </div>}
                </div>

                <div className="text-field-container password__field">
                    <input name={textFieldOptions.password.name} className={`text-field ${errors[textFieldOptions.password.name] ? 'red-border' : ''}`} ref={register(textFieldOptions.password.validations)} placeholder={textFieldOptions.password.placeholder} type="password" />
                    {errors[textFieldOptions.password.name] && <div className="text-field-error"> <div className="error-pointer"></div> <span> {errors[textFieldOptions.password.name].message}</span> </div>}
                </div>

                <div className="sign__up__options d-flex justify-content-center">
                    <button className="primary-btn auth-btn" type="submit"> Sign Up  </button>
                </div>
            </form>
        </div>
    )
}

export default SignUp
