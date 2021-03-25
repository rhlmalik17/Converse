interface UserDetails {
    first_name: string;
    last_name: string;
    profile_img: string;
    email: string;
}

/* USER TYPE */
export class User {
    public first_name: string;
    public last_name: string;
    public profile_img: string;
    public email: string;

    constructor(user_details: UserDetails) {
        this.first_name = user_details.first_name || "";
        this.last_name = user_details.last_name || "";
        this.profile_img = user_details.profile_img || "";
        this.email = user_details.email || "";
    }
}
