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
    public async uploadProfileImage(file: File) {
        if(!file || !file.name) {
            toastService.showToast("error", "File not supported");
            return false;
        }

        try {
            let fileName = file.name.split('.');
            let fileType = (fileName && fileName[fileName.length - 1]) || '';
    
            if(!this.supportedFileExtensions.profile_picture[fileType]) {
                toastService.showToast("error", "Invalid Extension");
                return false;
            }
    
            let encodedBase64String = await this.convertToBase64(file);
        } catch {
            toastService.showToast("error", "Unexpected Error Occurred");
        }
    }
}

export default new FileUploadService();