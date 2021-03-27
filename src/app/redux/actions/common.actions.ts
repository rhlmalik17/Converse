import { SkeletonLoader } from "../../../models/SkeletonModels/SkeletonLoader.model"

export const setUserData = (userData: any) => {
    return {
        type: "SET_USER_DATA",
        userData
    }
}

export const showSkeletonLoader = (showState: SkeletonLoader) => {
    return {
        type: "SHOW_SKELETON_LOADER",
        showState
    }
}