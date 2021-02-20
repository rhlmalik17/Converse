const currentLayoutMode = (state: boolean = false, action: any) => {
    switch(action.type) {
        case "TOGGLE_LAYOUT_MODE":
            return !state;
    }
}

export default currentLayoutMode;