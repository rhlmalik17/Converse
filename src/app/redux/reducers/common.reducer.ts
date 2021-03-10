const commonReducer = (commonState: any = {}, action: any) => {
    switch(action.type) {
        case "SET_USER_DATA":
            commonState.userData = action.userData;
            return commonState;

        default:
            return commonState;
    }
}

export default commonReducer;