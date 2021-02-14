import { toast } from 'react-toastify'

class ToastService {

  private readonly toastOptions: Object | any = {
    error: {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    },

    success: {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: 'Toastify__toast--success'
    }
  };

  public showToast(type: string, message: string, customOptions?: any): void {
    switch (type) {
      case "error":
        toast.error(message, customOptions || this.toastOptions.error);
        break;

      case "success":
        toast.success(message, customOptions || this.toastOptions.success);
        break;

      default:
        toast(message, customOptions || this.toastOptions.success);
        break;
    }
  }
}

export default new ToastService();