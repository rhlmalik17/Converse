const currentLayoutMode = (state: boolean = false, action: any) => {
    switch(action.type) {
        case "TOGGLE_LAYOUT_MODE":
            return !state;
        
        default:
            return state;
    }
}

export default currentLayoutMode;