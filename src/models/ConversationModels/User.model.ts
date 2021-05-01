interface UserDetails {
    first_name: string;
    last_name: string;
    profile_img: string;
    email: string;
}

/* USER ACTIVE STATUS */
export class UserActiveStatus {
    public userEmail: string = "";
    public isUserActive: boolean = false;
    constructor(userDetails?: { userEmail: string, isUserActive: boolean }) {
        this.userEmail = userDetails?.userEmail || "";
        this.isUserActive = userDetails?.isUserActive || false;
    }
}  

/* USER TYPE */
export class User {
    public first_name: string;
    public last_name: string;
    public profile_img: string;
    public email: string;

    constructor(user_details?: UserDetails) {
        this.first_name = user_details?.first_name || "";
        this.last_name = user_details?.last_name || "";
        this.profile_img = user_details?.profile_img || "";
        this.email = user_details?.email || "";
    }
}
