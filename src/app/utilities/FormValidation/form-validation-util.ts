export class FormValidationUtil  {
    /* All Form Field Types */
    field_validation_options: Object | any  = {
        name: {
            required: true,
            min: 3
        },

        password: {
            required: true,
            min: 3
        },

        email: {
            required: true,
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
    }

    getValidation(field_type: string): Object {
        if(!this.field_validation_options[field_type])
        return {};

        return this.field_validation_options[field_type];
    }

    getFieldError(field_type: string, value: any, errorObject: any): string {
        switch(field_type) {
            case "first_name" || "last_name" || "name":
                return this.validateName(field_type,value, errorObject);
            
            case "password": 
                return this.validatePassword(field_type,value, errorObject);

            case "email": 
                return this.validateEmail(field_type,value, errorObject);

            default:
                return ""
        }
    }

    // Validate Name
    validateName(field_type: string,value: string, errorObject: any): string {
        if(!errorObject[field_type])
        return "";

        //Convert name to Upper Case
        let name = field_type.split('_')
                    .map((char: string) => char.charAt(0).toUpperCase() + char.substring(1, char.length)).join(" ");
        
        if(!value) 
        return `${name} is required`;

        if(value.length < this.field_validation_options.name.min)
        return `${name} should have a minimum length of ${this.field_validation_options.name.min}`;


        return "";
    }

    //Validate Password
    validatePassword(field_type: string,value: string, errorObject: any): string {
        if(!errorObject[field_type])
        return "";
        
        if(!value) 
        return `Password  is required`;

        if(value.length < this.field_validation_options.password.min)
        return `Password should have a minimum length of ${this.field_validation_options.password.min}`;

        return "";
    }

    //Validate Email
    validateEmail(field_type: string,value: string, errorObject: any): string {
        if(!errorObject[field_type])
        return "";

        if(!value) 
        return `Email  is required`;

        if(this.field_validation_options.email.pattern.test(value))
        return `Email is invalid`

        return "";
    }
}

export default new FormValidationUtil();