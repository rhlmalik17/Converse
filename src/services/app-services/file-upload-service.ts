import { apiUrls } from "../api-services/api-urls";
import httpClient from "../api-services/http-client";
import toastService from "./toast-service";

class FileUploadService {
    private readonly supportedFileExtensions: any = {
        //Profile picture supported extensions
        profile_picture: {
            'jpg': true,
            'png': true,
            'jpeg': true,
            'svg': true,
            'gif': true
        }
    }

    //Convert file to base64
    public async convertToBase64(file: File) {
        if(!file)
        return "";

        const toBase64 = (file: File) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        
        let encodedString = await toBase64(file);
        return encodedString;
    }

    //Upload profile image
    public async uploadProfileImage(blob: Blob) {
        if(!blob) {
            toastService.showToast("error", "File not supported");
            return false;
        }
        try {
            let formData = new FormData();
            formData.append("profile_img", blob);
            return httpClient.put(apiUrls["upload-profile-image"].route, formData);
        } catch {
            toastService.showToast("error", "Unexpected Error Occurred");
        }
    }
}

export default new FileUploadService();