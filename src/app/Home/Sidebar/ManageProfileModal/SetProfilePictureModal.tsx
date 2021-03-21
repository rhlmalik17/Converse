import React, { useCallback, useEffect, useRef, useState } from 'react'
import fileUploadService from '../../../../services/app-services/file-upload-service';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const SetProfilePictureModal = (props: any) => {
    const profileImageRef = useRef(null);
    const [selectedImageState, setSelectedImageState] = useState<any>({
        src: null,
        mime: '',
        crop: {
            unit: '%',
            aspect: 1 / 1,
            height: 100
        }
    });


    const uploadImage = async () => {
        let blobFile: Blob = await getCroppedImg(profileImageRef.current, selectedImageState.crop) as Blob;
        fileUploadService.uploadProfileImage(blobFile).then((result: any) => {
            if (!result)
                return;

            props.onSuccessfullUpload(result);
            props.onHide();
        });
    }

    const setSelectorImage =  async () => {
        let selectedFileToBase64 = await fileUploadService.convertToBase64(props.selectedImage);
        setSelectedImageState({
            ...selectedImageState, src: selectedFileToBase64,
            mime: props?.selectedImage?.type || ''
        });
    }

    const getCroppedImg = async (image: any, crop: any) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
       
        ctx?.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        let imageBlob = await new Promise((resolve, reject) => {
            canvas.toBlob((blob: any) => {
              blob.name = 'profile_img';
              resolve(blob);
            }, selectedImageState.mime, 1);
          });
       
        return imageBlob;
      }

    const onCropChange = (crop: any, percentCrop: any) => {
        setSelectedImageState({ ...selectedImageState, crop });
    };

    const onLoad = useCallback((img: any) => {
        profileImageRef.current = img;
    }, []);

    useEffect( () => {
        //Get Image file to selector
        setSelectorImage();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
            <div className="image__selector__container d-flex flex-column">
            {
                selectedImageState.src &&
                <ReactCrop
                    className="image__selector"
                    src={selectedImageState.src}
                    crop={selectedImageState.crop}
                    ruleOfThirds
                    onChange={onCropChange}
                    onImageLoaded={onLoad}
                />
            }

                <span className="image__selector__instruction">Select an area for your profile photo</span>
                <div className="set__profileImage__options mt-3 d-flex justify-content-end">
                    <button onClick={() => props.onHide()}> CANCEL </button>
                    <button onClick={() => uploadImage()} className="ml-2"> SAVE </button>
                </div>
            </div>
    )
}

export default SetProfilePictureModal;
