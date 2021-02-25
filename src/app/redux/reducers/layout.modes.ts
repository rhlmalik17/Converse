const sideBarMode = (state: boolean = false, action: any) => {
    switch(action.type) {
        case "TOGGLE_SIDE_BAR":
            return !state;
        
        default:
            return state;
    }
}

export default sideBarMode;